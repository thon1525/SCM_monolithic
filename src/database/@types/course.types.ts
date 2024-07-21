import { FilterQuery, Types } from "mongoose";
import {
  ICourse,
  ICourseReport,
  ICourseResponse,
  PartialICourse,
} from "@scm/@types/course.types";
import { IQueryParams } from "@scm/@types/queryParams";

export interface ICourseSchema extends Document {
  name: string;
  professor_name: string;
  limit_number_of_students: number;
  start_date: Date;
  end_date: Date;
  enrolled_students: Types.ObjectId[];
  is_deleted: boolean;
  create_at: Date;
}

export type CourseQuery = {
  $or: {
    name?: RegExp;
    start_date?: { $gte: Date };
    end_date?: { $lte: Date };
  }[];
};

export interface ICourseRepository {
  create(course: ICourse): Promise<ICourseResponse>;
  findById(id: string): Promise<ICourseResponse>;
  findAll(): Promise<ICourseResponse[]>;
  updateById(
    id: string,
    updateCourse: PartialICourse
  ): Promise<ICourseResponse>;
  deleteById(id: string): Promise<void>; // Or you can return a success message or status if needed
  findOneByQuery(queries : IQueryParams):Promise<ICourseResponse | null>;
  findManyByQuery(queries : IQueryParams):Promise<ICourseResponse[]>;
  searchByQuery(
    queries: FilterQuery<CourseQuery>
  ): Promise<ICourseResponse[]>;
  getReport(): Promise<ICourseReport[]>;
}
