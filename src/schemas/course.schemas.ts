import { z } from 'zod';


// Define Zod schemas for validation
const CourseCreateSchema = z.object({
    name: z.string().min(1).max(255),
    professor_name: z.string().min(1).max(255),
    limit_number_of_students: z.number().int().positive(),
    start_date: z.string().min(1).max(255),
    end_date: z.string().min(1).max(255),
    enrolled_students: z.array(z.string()),
});



const CourseUpdateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    professor_name: z.string().min(1).max(255).optional(),
    limit_number_of_students: z.number().int().positive().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    enrolled_students: z.array(z.string()).optional(),
});

export {CourseCreateSchema , CourseUpdateSchema}