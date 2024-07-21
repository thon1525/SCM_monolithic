import {
  ICourse,
  ICourseReport,
  ICourseResponse,
} from "@scm/@types/course.types";
import { ICourseService } from "./@types/course-service.types";
import { CourseRepository } from "@scm/database/repositories/course.repository";
import { logger } from "@scm/utils/logger";
import { BaseCustomError } from "@scm/errors/base-custom-error";
import { StatusCode } from "@scm/utils/consts";
import { ApiError } from "@scm/errors/api-error";
import DuplicateError from "@scm/errors/duplicate-error";
import { ObjectId } from "mongodb";
import {
  areObjectIdArraysDisjoint,
  hasDuplicates,
} from "@scm/utils/duplicator";
import {
  IAdvanceSearch,
  IAdvanceSearchQuery,
  SearchQuery,
} from "@scm/@types/queryParams";
import NotFoundError from "@scm/errors/not-found-error";
import { StudentRepository } from "@scm/database/repositories/student.repository";
import { studentModel } from "@scm/database/models/student.model";

export class CourseService implements ICourseService {
  private static instance: CourseService;
  private CourseRepository: CourseRepository;
  private constructor() {
    this.CourseRepository = CourseRepository.getInstance();
  }

  static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  async createCourse(course: ICourse): Promise<ICourseResponse> {
    try {
      const studentDuplicated = hasDuplicates(course.enrolled_students);

      if (studentDuplicated) {
        throw new DuplicateError("Duplicated student ID!");
      }

      const newCourse = await this.CourseRepository.create(course);

      return newCourse;
    } catch (error: unknown) {
      logger.error(`An error accurred in createCourse() ${error}`);

      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new ApiError("Fail to create course!");
    }
  }

  async getCourseById(id: string): Promise<ICourseResponse> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new BaseCustomError("Invalid Course id!", StatusCode.BadRequest);
      }
      const course = await this.CourseRepository.findById(id);

      return course;
    } catch (error: unknown) {
      logger.error(`An error accurred in getCourseById() ${error}`);
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Faild to get course!");
    }
  }

  async getAllCourses(): Promise<ICourseResponse[]> {
    try {
      const course = await this.CourseRepository.findAll();

      return course;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateCourseById(
    id: string,
    course: Partial<ICourse>
  ): Promise<ICourseResponse> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new BaseCustomError("Invalid course id!", StatusCode.BadRequest);
      }

      const existingCourse = await this.CourseRepository.findById(id);

      if (!existingCourse) {
        throw new NotFoundError("No course found with the provided ID!");
      }
      const duplicatedCourse = hasDuplicates(
        course.enrolled_students ? course.enrolled_students : []
      );
      if (duplicatedCourse) {
        throw new DuplicateError("Duplicated course IDs!");
      }

      const updateFields: Partial<ICourse> = {
        ...(course?.name &&
          course?.name !== existingCourse.name && { name: course.name }),
        ...(course?.professor_name &&
          course?.professor_name !== existingCourse.professor_name && {
            professor_name: course?.professor_name,
          }),
        ...(course?.limit_number_of_students &&
          course?.limit_number_of_students !==
            existingCourse.limit_number_of_students && {
            limit_number_of_students: course?.limit_number_of_students,
          }),
        ...(course?.start_date &&
          new Date(course?.start_date).toISOString() !==
            existingCourse.start_date.toISOString() && {
            start_date: course?.start_date,
          }),
        ...(course?.end_date &&
          new Date(course?.end_date).toISOString() !==
            existingCourse.end_date.toISOString() && {
            end_date: course?.end_date,
          }),
        ...(course?.enrolled_students &&
          areObjectIdArraysDisjoint(
            course?.enrolled_students,
            existingCourse?.enrolled_students
          ) && {
            $addToSet: { enrolled_students: { $each: course?.enrolled_students } }
          }),
      };
      const hasUpdated = Object.keys(updateFields).length;

      if (hasUpdated === 0) {
        throw new NotFoundError("No value changes!", StatusCode.BadRequest);
      }

      if (updateFields?.enrolled_students) {
        // Find courses by their IDs and ensure they are not deleted
        const studnetRepo = StudentRepository.getInstance();
        const studnets = await studnetRepo.findManyByQuery({
          _id: { $in: course.enrolled_students },
          is_deleted: false,
        });

        if (studnets.length !== course.enrolled_students?.length) {
          throw new NotFoundError(
            "One or more students not found with the provided IDs!"
          );
        }

        const courseUpdated = await this.CourseRepository.updateById(
          id,
          updateFields
        );

        // Update the courses to include the new student's ID in enrolled_students
        await studentModel.updateMany(
          { _id: { $in: course.enrolled_students } },
          { $push: { enrolled_students: courseUpdated._id } }
        );

        return courseUpdated;
      }

      const courseUpdated = await this.CourseRepository.updateById(
        id,
        updateFields
      );

      return courseUpdated;
    } catch (error: unknown) {
      logger.error(`An error accurred in updateCourseById() ${error}`);

      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Faild to update Course!");
    }
  }

  async deleteCourseById(id: string): Promise<void> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new BaseCustomError("Invalid course id!", StatusCode.BadRequest);
      }
      await this.CourseRepository.deleteById(id);
    } catch (error: unknown) {
      logger.error(`An error accurred in deleteCourseById() ${error}`);
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new ApiError("Faild to delete course!");
    }
  }

  async searchCourses(searchTerm: string): Promise<ICourseResponse[]> {
    try {
      const searchFields: SearchQuery = {
        $or: [{ name: { $regex: searchTerm, $options: "i" } }],
      };

      const Courses = await this.CourseRepository.searchByQuery(searchFields);

      return Courses;
    } catch (error: unknown) {
      logger.error(`An error accurred in searchCourses() ${error}`);
      throw error;
    }
  }

  async advanceSearchCourses(
    searchTerm: Partial<IAdvanceSearch>
  ): Promise<ICourseResponse[]> {
    try {
      const searchFields: IAdvanceSearchQuery = {
        $or: [
          ...(searchTerm?.start_date
            ? [
                {
                  start_date: {
                    $gte: new Date(searchTerm.start_date as string),
                  },
                },
              ]
            : []),
          ...(searchTerm?.end_date
            ? [{ end_date: { $lte: new Date(searchTerm.end_date as string) } }]
            : []),
          // Add other conditions as needed
        ],
      };

      const courses = await this.CourseRepository.searchByQuery(searchFields);

      return courses;
    } catch (error: unknown) {
      logger.error(`An error accurred in searchCourses() ${error}`);
      throw error;
    }
  }

  async getCoursesReport(): Promise<ICourseReport[]> {
    try {
      const courses = await this.CourseRepository.getReport();

      return courses;
    } catch (error: unknown) {
      logger.error(`An error occurred in getCoursesReport() ${error}`);
      throw new ApiError("Failed to get courses report!");
    }
  }
}
