import { ICourse, ICourseReport, ICourseResponse } from "@scm/@types/course.types";
import { IAdvanceSearch } from "@scm/@types/queryParams";



export interface ICourseController {
    createCourse(Course: ICourse):Promise<ICourseResponse>;
    getCourse(id: string):Promise<ICourseResponse>;
    getAllCourses():Promise<ICourseResponse[]>
    updateCourse(id: string , course: Partial<ICourse>):Promise<ICourseResponse>
    deleteCourse(id: string):Promise<void>
    searchCourses(searchTerm: string):Promise<ICourseResponse[]>;
    advanceSearchCourses(searchTerms: IAdvanceSearch): Promise<ICourseResponse[]>;
    getCoursesReport():Promise<ICourseReport[]>
}
