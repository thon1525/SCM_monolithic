// errorHandler.test.ts
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { BaseCustomError } from '@scm/errors/base-custom-error';
import { errorHandler } from '../error-handler';

// Mock implementation of BaseCustomError
class MockCustomError extends BaseCustomError {
  constructor(public message: string,  statusCode: number) {
    super(message,statusCode);
    Object.setPrototypeOf(this, MockCustomError.prototype);
  }

  getStatusCode() {
    return this.statusCode;
  }
}

const app = express();

app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
  const error = new MockCustomError('Test error message', 400);
  next(error);
});

app.use(errorHandler);

describe('errorHandler middleware', () => {
  it('should handle BaseCustomError and respond with correct status code and message', async () => {
    const response = await request(app).get('/test-error');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Test error message',
        statusCode: 400
      }
    });
  });

  it('should call next() when the error is not an instance of BaseCustomError', async () => {
    const errorHandlerSpy = jest.fn((_error: Error, _req: Request, _res: Response, next: NextFunction) => {
      next();
    });

    app.use((_req: Request, _res: Response, next: NextFunction) => {
      const error = new Error('General error');
      next(error);
    });

    app.use(errorHandlerSpy);

    await request(app).get('/test-error');

    expect(errorHandlerSpy).toHaveBeenCalled();
  });
});
