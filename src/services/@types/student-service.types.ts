import { IStudent, IStudentReport, IStudentResponse, PartialIStudent } from "@scm/@types/student.types";


export interface IStudentService {
    createStudent(student: IStudent):Promise<IStudentResponse>;
    getStudentById(id: string):Promise<IStudentResponse>;
    getAllStudents():Promise<IStudentResponse[]>;
    updateStudentById(id: string , student: PartialIStudent):Promise<IStudentResponse>;
    deleteStudentById(id: string):Promise<void>;
    searchStudents(searchTerm: string):Promise<IStudentResponse[]>;
    register(studentId: string , courseId: string):Promise<IStudentResponse>;
    removeCourse(studentId: string , courseId: string):Promise<IStudentResponse>;
    getStudentsReport():Promise<IStudentReport[]>
}