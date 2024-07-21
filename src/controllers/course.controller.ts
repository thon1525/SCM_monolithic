import { CourseService } from "@scm/services/course.service";
import { ICourseController } from "./@types/course.types";
import { ICourse, ICourseReport, ICourseResponse } from "@scm/@types/course.types";
import { IAdvanceSearch } from "@scm/@types/queryParams";


export class CourseController implements ICourseController{
    private static instance: CourseController;
    private CourseService: CourseService;
    private constructor(){
        this.CourseService = CourseService.getInstance()
    };

    static getInstance():CourseController{
        if(!CourseController.instance){
            CourseController.instance = new CourseController()
        }
        return CourseController.instance;
    }

    async createCourse(course: ICourse): Promise<ICourseResponse> {
        try{
            const newCourse = await this.CourseService.createCourse(course);

            return newCourse;
        }catch(error: unknown){
            throw error
        }
    }


    async getCourse(id: string): Promise<ICourseResponse> {
        try{
            const course = await this.CourseService.getCourseById(id);

            return course
        }catch(error: unknown){
            throw error
        }
    }

    async getAllCourses(): Promise<ICourseResponse[]> {
        try{
            const courses = await this.CourseService.getAllCourses();

            return courses
        }catch(error: unknown){
            throw error
        }
    }
    

    async updateCourse(id: string , Course: Partial<ICourse>): Promise<ICourseResponse> {
        try{
            const courseUpdated = await this.CourseService.updateCourseById(id, Course);

            return courseUpdated
        }catch(error: unknown){
            throw error
        }
    }

    async deleteCourse(id: string): Promise<void> {
        try{
            await this.CourseService.deleteCourseById(id);
        }catch(error: unknown){
            throw error
        }
    }

    async searchCourses(searchTerm: string):Promise<ICourseResponse[]>{
        try{
            const course = await this.CourseService.searchCourses(searchTerm);
            return course
        }catch(error: unknown){
            throw error
        }
    }

    async advanceSearchCourses(searchTerm: Partial<IAdvanceSearch>):Promise<ICourseResponse[]>{
        try{
            const course = await this.CourseService.advanceSearchCourses(searchTerm);
            return course
        }catch(error: unknown){
            throw error
        }
    }

    
    async getCoursesReport(): Promise<ICourseReport[]> {
        try{
            const courses = await this.CourseService.getCoursesReport();
            return courses;
        }catch(error: unknown){
            throw error
        }
    }
}