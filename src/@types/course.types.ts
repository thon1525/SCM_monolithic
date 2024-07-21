import { Types } from "mongoose";

export interface ICourse {
    name: string;
    professor_name: string;
    limit_number_of_students: number;
    start_date: Date;
    end_date: Date;
    enrolled_students: Types.ObjectId[];
}

export interface PartialICourse {
    name?: string;
    professor_name?: string;
    limit_number_of_students?: number;
    start_date?: Date;
    end_date?: Date;
    enrolled_students?: Types.ObjectId[];
}


export interface ICourseReport {
    name: string;
    professor_name: string;
    start_date: Date;
    end_date: Date;
    limit_number_of_students: number;
    number_of_registered_students: number;
}



export interface ICourseResponse extends ICourse {
    _id: Types.ObjectId;
    is_deleted: boolean;
    create_at: Date
}