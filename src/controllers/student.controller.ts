import { StudentService } from "@scm/services/student.service";
import { IStudentController } from "./@types/student.types";
import {
  IStudent,
  IStudentReport,
  IStudentResponse,
} from "@scm/@types/student.types";

export class StudentController implements IStudentController {
  private static instance: StudentController;
  private studentService: StudentService;
  private constructor() {
    this.studentService = StudentService.getInstance();
  }

  static getInstance(): StudentController {
    if (!StudentController.instance) {
      StudentController.instance = new StudentController();
    }
    return StudentController.instance;
  }

  async createStudent(student: IStudent): Promise<IStudentResponse> {
    try {
      const newStudent = await this.studentService.createStudent(student);

      return newStudent;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getStudent(id: string): Promise<IStudentResponse> {
    try {
      const student = await this.studentService.getStudentById(id);

      return student;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllStudents(): Promise<IStudentResponse[]> {
    try {
      const students = await this.studentService.getAllStudents();

      return students;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateStudent(
    id: string,
    student: Partial<IStudent>
  ): Promise<IStudentResponse> {
    try {
      const studentUpdated = await this.studentService.updateStudentById(
        id,
        student
      );

      return studentUpdated;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await this.studentService.deleteStudentById(id);
    } catch (error: unknown) {
      throw error;
    }
  }

  async searchStudents(searchTerm: string): Promise<IStudentResponse[]> {
    try {
      const students = await this.studentService.searchStudents(searchTerm);

      return students;
    } catch (error: unknown) {
      throw error;
    }
  }

  async register(
    studentId: string,
    courseId: string
  ): Promise<IStudentResponse> {
    try {
      const student = await this.studentService.register(studentId, courseId);

      return student;
    } catch (error: unknown) {
      throw error;
    }
  }

  async removeCourse(
    studentId: string,
    courseId: string
  ): Promise<IStudentResponse> {
    try {
      const student = await this.studentService.removeCourse(
        studentId,
        courseId
      );

      return student;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getStudentsReport(): Promise<IStudentReport[]> {
    try {
      const studnets = await this.studentService.getStudentsReport();
      return studnets;
    } catch (error: unknown) {
      throw error;
    }
  }
}
