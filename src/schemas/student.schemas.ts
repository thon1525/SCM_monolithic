import { z } from 'zod';

const StudentCreateSchema = z.object({
    full_name_en: z.string().min(1).max(255),  
    full_name_km: z.string().min(1).max(255),  
    date_of_birth: z.string().min(1).max(255),                  
    gender: z.enum(['male', 'female', 'other']), 
    phone_number: z.string().min(8).max(20),
    courses: z.array(z.string()).optional()   
});

const StudentUpdateSchema = z.object({
    full_name_en: z.string().min(1).max(255).optional(),  
    full_name_km: z.string().min(1).max(255).optional(),  
    date_of_birth: z.string().optional(),                  
    gender: z.enum(['male', 'female', 'other']).optional(), 
    phone_number: z.string().min(1).max(20).optional(),
    courses: z.array(z.string()).optional()   
});

export {StudentCreateSchema , StudentUpdateSchema}