import {
  ICourse,
  ICourseReport,
  ICourseResponse,
} from "@scm/@types/course.types";
import { logger } from "@scm/utils/logger";
import { courseModel } from "../models/course.model";
import { ApiError } from "@scm/errors/api-error";
import NotFoundError from "@scm/errors/not-found-error"; // Renamed from `NotFound` to `NotFoundError`
import { ObjectId } from "mongodb";
import { CourseQuery, ICourseRepository } from "../@types/course.types";
import { IQueryParams } from "@scm/@types/queryParams";
import DuplicateError from "@scm/errors/duplicate-error";
import { FilterQuery } from "mongoose";

export class CourseRepository implements ICourseRepository {
  private static instance: CourseRepository;

  private constructor() {}

  static getInstance(): CourseRepository {
    if (!CourseRepository.instance) {
      CourseRepository.instance = new CourseRepository();
    }
    return CourseRepository.instance;
  }

  async create(course: ICourse): Promise<ICourseResponse> {
    try {
        
      const newCourse = new courseModel({
        ...course,
        is_deleted: false,
      });

      const savedCourse = await newCourse.save(); // Await save() method

      if (!savedCourse) {
        throw new ApiError("Failed to create Course!");
      }

      return savedCourse as ICourseResponse; // Type assertion if necessary
    } catch (error: unknown) {
      logger.error(`An error occurred in create(): ${error}`);

      if (error instanceof ApiError || error instanceof DuplicateError) {
        throw error;
      }

      throw new ApiError("Unexpected error occurred while creating Course");
    }
  }

  async findById(id: string): Promise<ICourseResponse> {
    try {
      const course = await courseModel.findOne({
        _id: new ObjectId(id),
        is_deleted: false,
      });

      if (!course) {
        throw new NotFoundError(`No Course found with the specific ID!`);
      }

      return course;
    } catch (error: unknown) {
      logger.error(`An error occurred in findById() ${error}`);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new ApiError(`Unexpected error occurred while finding course!`);
    }
  }

  async findAll(): Promise<ICourseResponse[]> {
    try {
      const courses = await courseModel.find({
        is_deleted: false,
      });

      if (!courses || courses.length === 0) {
        throw new NotFoundError(`No courses found!`);
      }

      return courses;
    } catch (error: unknown) {
      logger.error(`An error occurred in findAll() ${error}`);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new ApiError(
        `Unexpected error occurred while finding all courses!`
      );
    }
  }

  async updateById(
    id: string,
    course: Partial<ICourse>
  ): Promise<ICourseResponse> {
    try {
      const existingCourse = await this.findOneByQuery({
        _id: new ObjectId(id),
        is_deleted: false,
      });

      if (!existingCourse) {
        throw new NotFoundError("No Course found with the specific ID!");
      }
      const courseUpdated = await courseModel.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        course,
        { new: true }
      );

      if (!courseUpdated) {
        throw new ApiError(`Failed to update Course!`);
      }

      return courseUpdated;
    } catch (error: unknown) {
      logger.error(`An error occurred in updateById() ${error}`);
      if (error instanceof ApiError || error instanceof NotFoundError) {
        throw error;
      }
      throw new ApiError(`Unexpected error occurred while updating course`);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const existingCourse = await this.findOneByQuery({
        _id: new ObjectId(id),
        is_deleted: false,
      });

      if (!existingCourse) {
        throw new NotFoundError("No course found with the provide ID!");
      }

      const courseDeleted = await courseModel.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { is_deleted: true },
        { new: true }
      );

      if (courseDeleted?.is_deleted === false) {
        throw new ApiError(`Failed to delete Course!`);
      }
    } catch (error: unknown) {
      logger.error(`An error occurred in deleteById() ${error}`);
      if (
        error instanceof ApiError ||
        error instanceof DuplicateError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }
      throw new ApiError(`Unexpected error occurred while deleting Course`);
    }
  }

  async findOneByQuery(queries: IQueryParams): Promise<ICourseResponse | null> {
    try {
      const course = await courseModel.findOne(queries).exec();

      return course;
    } catch (error: unknown) {
      logger.error(`An error occurred in findOneByQuery() ${error}`);

      throw new ApiError(`Unexpected error occurred while finding course`);
    }
  }

  async findManyByQuery(queries: IQueryParams): Promise<ICourseResponse[]> {
    try {
      const courses = await courseModel.find(queries).exec();

      return courses;
    } catch (error: unknown) {
      logger.error(`An error occurred in findManyByQuery() ${error}`);

      throw new ApiError(`Unexpected error occurred while finding courses`);
    }
  }

  async searchByQuery(
    query: FilterQuery<CourseQuery>
  ): Promise<ICourseResponse[]> {
    try {
      const courses = await courseModel
        .find({
          ...query,
          is_deleted: false,
        })
        .exec();

      if (!courses || courses.length === 0) {
        throw new NotFoundError(`Can not find course!`);
      }

      return courses;
    } catch (error: unknown) {
      logger.error(`An error occurred in searchCoursesByQuery(): ${error}`);

      if (error instanceof NotFoundError) {
        throw error; // rethrow known errors
      } else {
        throw new ApiError(
          `Unexpected error occurred while searching for Courses`
        );
      }
    }
  }

  async getReport(): Promise<ICourseReport[]> {
    try {
      const courses: ICourseReport[] = await courseModel.aggregate([
        {
          $match: { is_deleted: false }, // Filter out deleted courses
        },
        {
          $project: {
            name: 1,
            professor_name: 1,
            start_date: 1,
            end_date: 1,
            limit_number_of_students: 1,
            number_of_registered_students: {
              $size: { $ifNull: ["$enrolled_students", []] },
            },
          },
        },
      ]);

      if (!courses) {
        throw new NotFoundError("No courses report found!");
      }

      return courses;
    } catch (error: unknown) {
      logger.error(`An error occurred in getReport(): ${error}`);

      if (error instanceof NotFoundError) {
        throw error; // rethrow known errors
      } else {
        throw new ApiError(
          `Unexpected error occurred while get reporting for courses`
        );
      }
    }
  }
}
