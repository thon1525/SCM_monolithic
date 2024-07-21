import request from 'supertest';
import express, { NextFunction , Request , Response} from 'express';
import { zodValidator } from '@scm/middlewares/zod-validator';
import { StatusCode } from '@scm/utils/consts';
import { ApiError } from '@scm/errors/api-error';
import { BaseCustomError } from '@scm/errors/base-custom-error';
import { logger } from '@scm/utils/logger';
import { z, ZodSchema } from 'zod';

jest.mock('@scm/utils/logger');

const app = express();
app.use(express.json());

const schema: ZodSchema<any> = z.object({
  name: z.string(),
  age: z.number(),
});

app.post('/test', zodValidator(schema), (_req, res) => {
  res.status(StatusCode.OK).json({ success: true });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError || err instanceof BaseCustomError) {
    return res.status(err.getStatusCode()).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.getStatusCode(),
      },
    });
  }
  res.status(StatusCode.InternalServerError).json({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: StatusCode.InternalServerError,
    },
  });
});

describe('zodValidator middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle ZodError and return 422', async () => {
    const response = await request(app)
      .post('/test')
      .send({ name: 'John' }); // Missing 'age' field

    expect(response.status).toBe(StatusCode.UnprocessableEntity);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: expect.any(String),
        statusCode: StatusCode.UnprocessableEntity,
      },
    });
  });

  it('should handle unexpected errors and return 500', async () => {
    const mockParse = jest.fn(() => {
      throw new Error('Unexpected error');
    });

    schema.parse = mockParse as any;

    const response = await request(app)
      .post('/test')
      .send({ name: 'John', age: 30 });

    expect(logger.error).toHaveBeenCalled();
    expect(response.status).toBe(StatusCode.InternalServerError);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: StatusCode.InternalServerError,
      },
    });
  });
});
