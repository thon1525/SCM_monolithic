import {
  IStudent,
  IStudentReport,
  IStudentResponse,
} from "@scm/@types/student.types";
import { IStudentService } from "./@types/student-service.types";
import { StudentRepository } from "@scm/database/repositories/student.repository";
import { logger } from "@scm/utils/logger";
import { BaseCustomError } from "@scm/errors/base-custom-error";
import { StatusCode } from "@scm/utils/consts";
import { ApiError } from "@scm/errors/api-error";
import DuplicateError from "@scm/errors/duplicate-error";
import { ObjectId } from "mongodb";
import { SearchQuery } from "@scm/@types/queryParams";
import NotFoundError from "@scm/errors/not-found-error";
import { CourseRepository } from "@scm/database/repositories/course.repository";
import { Types } from "mongoose";
import {
  areObjectIdArraysDisjoint,
  hasDuplicates,
} from "@scm/utils/duplicator";
import { courseModel } from "@scm/database/models/course.model";

export class StudentService implements IStudentService {
  private static instance: StudentService;
  private studentRepository: StudentRepository;
  private constructor() {
    this.studentRepository = StudentRepository.getInstance();
  }

  static getInstance(): StudentService {
    if (!StudentService.instance) {
      StudentService.instance = new StudentService();
    }
    return StudentService.instance;
  }

  async createStudent(student: IStudent): Promise<IStudentResponse> {
    try {
      // Check for duplicated courses
      const duplicatedCourse = hasDuplicates(
        student.courses ? student.courses : []
      );
      if (duplicatedCourse) {
        throw new DuplicateError("Duplicated course IDs!");
      }

      // Find courses by their IDs and ensure they are not deleted
      const courseRepo = CourseRepository.getInstance();
      const courses = await courseRepo.findManyByQuery({
        _id: { $in: student.courses },
        is_deleted: false,
      });

      if (courses.length !== student.courses!.length) {
        throw new NotFoundError(
          "One or more courses not found with the provided IDs!"
        );
      }

      // Create the new student
      const newStudent = await this.studentRepository.create(student);

      // Update the courses to include the new student's ID in enrolled_students
      await courseModel.updateMany(
        { _id: { $in: student.courses } },
        { $push: { enrolled_students: newStudent._id } }
      );

      return newStudent;
    } catch (error: unknown) {
      logger.error(`An error accurred in createStudent() ${error}`);

      if (error instanceof DuplicateError || error instanceof NotFoundError) {
        throw error;
      }
      throw new ApiError("Fail to create student!");
    }
  }

  async getStudentById(id: string): Promise<IStudentResponse> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new BaseCustomError("Invalid student id!", StatusCode.BadRequest);
      }
      const student = await this.studentRepository.findById(id);

      return student;
    } catch (error: unknown) {
      logger.error(`An error accurred in getStudentById() ${error}`);
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Faild to get student!");
    }
  }

  async getAllStudents(): Promise<IStudentResponse[]> {
    try {
      const students = await this.studentRepository.findAll();

      return students;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateStudentById(
    id: string,
    student: Partial<IStudent>
  ): Promise<IStudentResponse> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new BaseCustomError("Invalid student id!", StatusCode.BadRequest);
      }
      const existingStudent = await this.studentRepository.findById(id);

      if (!existingStudent) {
        throw new NotFoundError("No student found with the provided ID!");
      }

      const updateFields: Partial<IStudent> = {
        ...(student?.full_name_en &&
          student.full_name_en !== existingStudent.full_name_en && {
            full_name_en: student.full_name_en,
          }),
        ...(student?.full_name_km &&
          student.full_name_km !== existingStudent.full_name_km && {
            full_name_km: student.full_name_km,
          }),
        ...(student?.gender &&
          student.gender !== existingStudent.gender && {
            gender: student.gender,
          }),
        ...(student?.date_of_birth &&
          new Date(student.date_of_birth).toISOString() !==
            existingStudent.date_of_birth.toISOString() && {
            date_of_birth: student.date_of_birth,
          }),
        ...(student?.phone_number &&
          student.phone_number !== existingStudent.phone_number && {
            phone_number: student.phone_number,
          }),
        ...(student?.courses &&
          areObjectIdArraysDisjoint(
            student?.courses,
            existingStudent.courses!
          ) && {
            $addToSet: { courses: { $each: student?.courses } },
          }),
      };
      const hasUpdated = Object.keys(updateFields).length;

      if (hasUpdated === 0) {
        throw new NotFoundError("No value changes!", StatusCode.BadRequest);
      }

      if (updateFields?.courses) {
        // Find courses by their IDs and ensure they are not deleted
        const studnetRepo = StudentRepository.getInstance();
        const studnets = await studnetRepo.findManyByQuery({
          _id: { $in: student.courses },
          is_deleted: false,
        });

        if (studnets.length !== student.courses?.length) {
          throw new NotFoundError(
            "One or more courses not found with the provided IDs!"
          );
        }

        const studentUpdated = await this.studentRepository.updateById(
          id,
          updateFields
        );

        // Update the courses to include the new student's ID in courses
        await courseModel.updateMany(
          { _id: { $in: student.courses } },
          { $push: { courses: studentUpdated._id } }
        );

        return studentUpdated;
      }
      const studentUpdated = await this.studentRepository.updateById(
        id,
        updateFields
      );

      return studentUpdated;
    } catch (error: unknown) {
      logger.error(`An error accurred in getStudentById() ${error}`);

      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Faild to update student!");
    }
  }

  async deleteStudentById(id: string): Promise<void> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new BaseCustomError("Invalid student id!", StatusCode.BadRequest);
      }
      await this.studentRepository.deleteById(id);
    } catch (error: unknown) {
      logger.error(`An error accurred in deleteStudentById() ${error}`);
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Faild to delete student!");
    }
  }

  async searchStudents(searchTerm: string): Promise<IStudentResponse[]> {
    try {
      const searchFields: SearchQuery = {
        $or: [
          { full_name_en: { $regex: searchTerm, $options: "i" } },
          { full_name_km: { $regex: searchTerm, $options: "i" } },
          { phone_number: { $regex: searchTerm, $options: "i" } },
        ],
      };

      const students = await this.studentRepository.searchByQuery(searchFields);

      return students;
    } catch (error: unknown) {
      logger.error(`An error accurred in searchStudents() ${error}`);

      throw error;
    }
  }

  async register(
    studentId: string,
    courseId: string
  ): Promise<IStudentResponse> {
    try {
      if (
        !Types.ObjectId.isValid(studentId) ||
        !Types.ObjectId.isValid(courseId)
      ) {
        throw new BaseCustomError("Invalid ID format!", StatusCode.BadRequest);
      }

      const student = (await this.studentRepository.findById(studentId)) as any;
      if (!student) {
        throw new NotFoundError("No student found!");
      }

      const courseService = CourseRepository.getInstance();
      const course = (await courseService.findById(courseId)) as any;
      if (!course) {
        throw new NotFoundError("No course found!");
      }

      if (student.courses.includes(course._id)) {
        throw new DuplicateError("You're already registered to this course!");
      }

      if (course.enrolled_students.includes(student._id)) {
        throw new DuplicateError("You're already registered to this course!");
      }

      student.courses.push(course._id);
      course.enrolled_students.push(student._id);

      // Save the updated documents to the database
      await student.save();
      await course.save();

      return student;
    } catch (error: unknown) {
      logger.error(`An error occurred in register() ${error}`);
      if (
        error instanceof BaseCustomError ||
        error instanceof NotFoundError ||
        error instanceof DuplicateError
      ) {
        throw error;
      }
      throw new ApiError("Failed to register!");
    }
  }

  async removeCourse(
    studentId: string,
    courseId: string
  ): Promise<IStudentResponse> {
    try {
      if (
        !Types.ObjectId.isValid(studentId) ||
        !Types.ObjectId.isValid(courseId)
      ) {
        throw new BaseCustomError("Invalid ID format!", StatusCode.BadRequest);
      }

      const student = (await this.studentRepository.findById(studentId)) as any;
      if (!student) {
        throw new NotFoundError("No student found!");
      }

      const courseService = CourseRepository.getInstance();
      const course = (await courseService.findById(courseId)) as any;
      if (!course) {
        throw new NotFoundError("No course found!");
      }

      student.courses = student.courses.filter(
        (course: ObjectId) => !course.equals(courseId)
      );
      await student.save();

      course.enrolled_students = course.enrolled_students.filter(
        (student: ObjectId) => !student.equals(studentId)
      );
      await course.save();

      return student;
    } catch (error: unknown) {
      logger.error(`An error occurred in register() ${error}`);
      if (
        error instanceof BaseCustomError ||
        error instanceof NotFoundError ||
        error instanceof DuplicateError
      ) {
        throw error;
      }
      throw new ApiError("Failed to register!");
    }
  }

  async getStudentsReport(): Promise<IStudentReport[]> {
    try {
      const students = await this.studentRepository.getReport();

      return students;
    } catch (error: unknown) {
      logger.error(`An error occurred in getStudentReport() ${error}`);
      throw new ApiError("Failed to get students report!");
    }
  }
}
