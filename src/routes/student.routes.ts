import { NextFunction , Request , Response, Router } from "express";
import { ApiRoutes } from ".";
import { StudentController } from "@scm/controllers/student.controller";
import { StatusCode } from "@scm/utils/consts";
import { zodValidator } from "@scm/middlewares/zod-validator";
import { StudentCreateSchema, StudentUpdateSchema } from "@scm/schemas/student.schemas";


const studentRouter:Router = Router();

studentRouter.post(ApiRoutes.CREATE_STUDENT, zodValidator(StudentCreateSchema),  async (req: Request, res: Response, _next: NextFunction) =>{
    try{
        const controller = StudentController.getInstance();
        const newStudent = await controller.createStudent(req.body);

        res.status(StatusCode.Created).json({
            success: true,
            statusCode: StatusCode.Created,
            message: "Success create new student",
            data:  newStudent
        })
    }catch(error: unknown){
        _next(error)
    }
});

studentRouter.get(ApiRoutes.STUDENT_REPORT , async (_req: Request , res: Response , _next: NextFunction) =>{
    try{

        const controller = StudentController.getInstance();
        const students = await controller.getStudentsReport()


        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success get report for student",
            data: students
        })
    }catch(error: unknown){
        _next(error)
    }
})


studentRouter.get(ApiRoutes.SEARCH_STUDENTS, async (req: Request, res: Response, _next: NextFunction) =>{
    try{    
        const serachTerm = req.query.query as string

        const controller = StudentController.getInstance();
        const students = await controller.searchStudents(serachTerm);

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success search student",
            data: students
        })
    }catch(error: unknown){
        _next(error)
    }
})


studentRouter.get(ApiRoutes.LIST_STUDENTS, async (_req: Request , res: Response , _next: NextFunction) =>{
    try{
        const controller = StudentController.getInstance();
        const students = await controller.getAllStudents()

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success retrieved students",
            data: students
        })
    }catch(error: unknown){
        _next(error)
    }
});


studentRouter.get(ApiRoutes.RETRIEVE_STUDENT, async (req: Request , res: Response , _next: NextFunction) =>{
    try{
        const studentId = req.params?.id.toString();

        const controller =  StudentController.getInstance();
        const student = await controller.getStudent(studentId)

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success retrieved student",
            data: student
        })
    }catch(error: unknown){
        _next(error)
    }
})




studentRouter.put(ApiRoutes.UPDATE_STUDENT, zodValidator(StudentUpdateSchema), async (req: Request , res: Response , _next: NextFunction) =>{
    try{
        const studentId = req.params?.id.toString();
        const student = req.body;

        const controller = StudentController.getInstance();
        const studentUpdated = await controller.updateStudent(studentId , student);

        res.status(StatusCode.Created).json({
            success: true,
            statusCode: StatusCode.Created,
            message: "Success updated student",
            data: studentUpdated
        })
    }catch(error: unknown){
        _next(error)
    }
})


studentRouter.delete(ApiRoutes.DELETE_STUDENT, async (req: Request , res: Response, _next: NextFunction) =>{
    try{
        const studentId = req.params?.id.toString();

        const controller = StudentController.getInstance();
        await controller.deleteStudent(studentId);

        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success deleted student",
            data: null
        })
    }catch(error){
        _next(error)
    }
})



studentRouter.post(ApiRoutes.REGISTER_COURSE_FOR_STUDENT , async (req: Request , res: Response , _next: NextFunction) =>{
    try{
        const studnetId = req.params.studentId;
        const courseId = req.params.courseId;

        const controller = StudentController.getInstance();
        const student = await controller.register(studnetId , courseId);


        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success registed student",
            data: student
        })
    }catch(error: unknown){
        _next(error)
    }
})


studentRouter.delete(ApiRoutes.REMOVE_COURSE_FOR_STUDENT , async (req: Request , res: Response , _next: NextFunction) =>{
    try{
        const studnetId = req.params.studentId;
        const courseId = req.params.courseId;

        const controller = StudentController.getInstance();
        const student = await controller.removeCourse(studnetId , courseId);


        res.status(StatusCode.OK).json({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success deleted course for student",
            data: student
        })
    }catch(error: unknown){
        _next(error)
    }
})




export default studentRouter;