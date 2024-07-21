import { Types } from "mongoose";

export interface IStudent {
    full_name_en: string;
    full_name_km: string;
    date_of_birth: Date;
    gender: 'male' | 'female' | 'other';
    phone_number: string;
    courses?: Types.ObjectId[]
}

export interface PartialIStudent {
    full_name_en?: string;
    full_name_km?: string;
    date_of_birth?: Date;
    gender?: 'male' | 'female' | 'other';
    phone_number?: string;
    courses?: Types.ObjectId[];
    _id?: Types.ObjectId;
    is_deleted?: boolean;
    create_at?: Date
}


export interface IStudentResponse extends IStudent {
    _id: Types.ObjectId;
    is_deleted: boolean;
    create_at: Date
}


export interface IStudentReport {
    full_name_en: string;
    full_name_km: string;
    date_of_birth: Date;
    gender: 'male' | 'female' | 'other';
    phone_number: string;
    number_of_courses: number;
}
