import { ICourse, ICourseReport, ICourseResponse, PartialICourse } from "@scm/@types/course.types";
import { IAdvanceSearch } from "@scm/@types/queryParams";


export interface ICourseService {
    createCourse(course: ICourse):Promise<ICourseResponse>;
    getCourseById(id: string):Promise<ICourseResponse>;
    updateCourseById(id: string , course: PartialICourse):Promise<ICourseResponse>;
    getAllCourses():Promise<ICourseResponse[]>
    deleteCourseById(id: string):Promise<void>;
    searchCourses(searchTerm: string):Promise<ICourseResponse[]>;
    advanceSearchCourses(searchTerm: IAdvanceSearch):Promise<ICourseResponse[]>;
    getCoursesReport():Promise<ICourseReport[]>

}