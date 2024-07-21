import { BaseCustomError } from '@scm/errors/base-custom-error';
import { Request, Response, NextFunction} from 'express'


export const errorHandler = async (error: Error, _req: Request, res: Response, _next: NextFunction) =>{
    if(error instanceof BaseCustomError){
    const statusCode = error.getStatusCode();
        res.status(statusCode).json({
            success: false,
            error: {
                message: error.message,
                statusCode: statusCode
              }
        })
    }
    _next()
}