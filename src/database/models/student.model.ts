import { model, Schema, Types } from "mongoose";
import { IStudentSchema } from "../@types/student.types";

const StudentSchema = new Schema({
    full_name_en: {
        type: String,
        required: true
    },
    full_name_km: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    courses: [{ type: Types.ObjectId, ref: 'Courses'  }],
    is_deleted: {
        type: Boolean,
        default: false
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

// Indexes
StudentSchema.index({ phone_number: 1 }); // Index on phone_number for efficient lookup
StudentSchema.index({ full_name_en: 1, full_name_km: 1 }); // Index on full_name_en and full_name_km for name searches

export const studentModel = model<IStudentSchema>("students", StudentSchema);
