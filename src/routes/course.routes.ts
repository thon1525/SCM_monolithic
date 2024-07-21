import { NextFunction , Request , Response, Router } from "express";
import { ApiRoutes } from ".";
import { CourseController } from "@scm/controllers/course.controller";
import { StatusCode } from "@scm/utils/consts";
import { zodValidator } from "@scm/middlewares/zod-validator";
import { CourseCreateSchema, CourseUpdateSchema } from "@scm/schemas/course.schemas";
import { IAdvanceSearch } from "@scm/@types/queryParams";


const courseRouter:Router = Router();

courseRouter.post(ApiRoutes.CREATE_COURSE, zodValidator(CourseCreateSchema),  async (req: Request, res: Response, _next: NextFunction) =>{
    try{
        const controller = CourseController.getInstance();
        const newCourse = await controller.createCourse(req.body);

        res.status(StatusCode.Created).json({
            success: true,
            statusCode: StatusCode.Created,
            message: "Success create new course",
            data:  newCourse
        })
    }catch(error: unknown){
        _next(error)
    }
});

courseRouter.get(ApiRoutes.COURSE_REPORT , async (_req: Request , res: Response , _next: NextFunction) =>{
    try{


        const controller = CourseController.getInstance();
        const courses = await controller.getCoursesReport()


        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success get report for courses",
            data: courses
        })
    }catch(error: unknown){
        _next(error)
    }
})

courseRouter.get(ApiRoutes.LIST_COURSES, async (_req: Request , res: Response , _next: NextFunction) =>{
    try{
        const controller = CourseController.getInstance();
        const courses = await controller.getAllCourses()

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success retrieved courses",
            data: courses
        })
    }catch(error: unknown){
        _next(error)
    }
})


courseRouter.get(ApiRoutes.SEARCH_COURSES, async (req: Request, res: Response, _next: NextFunction) =>{
    try{    
        const serachTerm = req.query.query as string

        const controller = CourseController.getInstance();
        const courses = await controller.searchCourses(serachTerm);

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success search for courses",
            data: courses
        })
    }catch(error: unknown){
        _next(error)
    }
})


courseRouter.get(ApiRoutes.ADVANCED_SEARCH_COURSES, async (req: Request, res: Response, _next: NextFunction) =>{
    try{    
        const {start_date , end_date } = req.query as Partial<IAdvanceSearch>;

        const controller = CourseController.getInstance();
        const courses = await controller.advanceSearchCourses({start_date, end_date});

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success search courses",
            data: courses
        })
    }catch(error: unknown){
        _next(error)
    }
})


courseRouter.get(ApiRoutes.RETRIEVE_COURSE, async (req: Request , res: Response , _next: NextFunction) =>{
    try{
        const courseId = req.params?.id.toString();

        const controller =  CourseController.getInstance();
        const course = await controller.getCourse(courseId)

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success retrieved course",
            data: course
        })
    }catch(error: unknown){
        _next(error)
    }
})

courseRouter.put(ApiRoutes.UPDATE_COURSE, zodValidator(CourseUpdateSchema), async (req: Request , res: Response , _next: NextFunction) =>{
    try{
        const courseId = req.params?.id.toString();
        const course = req.body;

        const controller = CourseController.getInstance();
        const courseUpdated = await controller.updateCourse(courseId , course);

        res.status(StatusCode.Created).json({
            success: true,
            statusCode: StatusCode.Created,
            message: "Success updated course",
            data: courseUpdated
        })
    }catch(error: unknown){
        _next(error)
    }
})


courseRouter.delete(ApiRoutes.DELETE_COURSE, async (req: Request , res: Response, _next: NextFunction) =>{
    try{
        const courseId = req.params?.id.toString();

        const controller = CourseController.getInstance();
        await controller.deleteCourse(courseId);

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success deleted course",
            data: null
        })
    }catch(error){
        _next(error)
    }
})


export default courseRouter;