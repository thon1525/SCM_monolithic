import {  IStudent, IStudentReport, IStudentResponse } from "@scm/@types/student.types";


export interface IStudentController {
    createStudent(student: IStudent):Promise<IStudentResponse>;
    getStudent(id: string):Promise<IStudentResponse>;
    getAllStudents():Promise<IStudentResponse[]>
    updateStudent(id: string , student: IStudent):Promise<IStudentResponse>
    deleteStudent(id: string):Promise<void>
    searchStudents(searchTerm: string):Promise<IStudentResponse[]>;
    register(studentId: string , courseId: string):Promise<IStudentResponse>;
    removeCourse(studentId: string , courseId: string):Promise<IStudentResponse>;
    getStudentsReport():Promise<IStudentReport[]>
}