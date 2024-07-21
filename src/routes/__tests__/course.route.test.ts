import request from 'supertest';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import { StatusCode } from '@scm/utils/consts';
import courseRouter from '../course.routes';
import { getConfig } from '@scm/utils/configs';
import { ApiRoutes } from '..';

const config = getConfig();

describe('Course API Routes', () => {
    let app: Application;
    const testDbUri = config.mongoUrl;

    beforeAll(async () => {
        await mongoose.connect(testDbUri!);

        app = express();
        app.use(express.json());
        app.use(ApiRoutes.BASE_COURSE, courseRouter);
    });

    afterAll(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        await mongoose.connection.close();
    });

    test('POST /courses - create course', async () => {
        const newCourse = {
            name: 'Introduction to Computer Science',
            professor_name: 'Dr. Jane Smith',
            limit_number_of_students: 30,
            start_date: '2024-09-01',
            end_date: '2024-12-15',
            enrolled_students: [],
        };

        const response = await request(app)
            .post(`${ApiRoutes.BASE_COURSE}${ApiRoutes.CREATE_COURSE}`)
            .send(newCourse)
            .expect(StatusCode.Created);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.Created,
            message: 'Success create new course',
            data: expect.any(Object),
        });
    });

    test('GET /courses/report - get courses report', async () => {
        const response = await request(app)
            .get(`${ApiRoutes.BASE_COURSE}${ApiRoutes.COURSE_REPORT}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: 'Success get report for courses',
            data: expect.any(Array),
        });
    });

    test('GET /courses/search - search courses', async () => {
        const searchTerm = 'Computer Science';
        const response = await request(app)
            .get(`${ApiRoutes.BASE_COURSE}${ApiRoutes.SEARCH_COURSES}`)
            .query({ query: searchTerm })
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: 'Success search for courses',
            data: expect.any(Array),
        });
    });

    test('GET /courses - list courses', async () => {
        const response = await request(app)
            .get(`${ApiRoutes.BASE_COURSE}${ApiRoutes.LIST_COURSES}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: 'Success retrieved courses',
            data: expect.any(Array),
        });
    });

    test('GET /courses/:id - retrieve course', async () => {
        const newCourse = {
            name: 'Introduction to Computer Science',
            professor_name: 'Dr. Jane Smith',
            limit_number_of_students: 30,
            start_date: '2024-09-01',
            end_date: '2024-12-15',
            enrolled_students: [],
        };

        const createdCourseResponse = await request(app)
            .post(`${ApiRoutes.BASE_COURSE}${ApiRoutes.CREATE_COURSE}`)
            .send(newCourse)
            .expect(StatusCode.Created);

        const courseId = createdCourseResponse.body.data._id;

        const response = await request(app)
            .get(`${ApiRoutes.BASE_COURSE}/${courseId}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: 'Success retrieved course',
            data: expect.any(Object),
        });
    });

    test('PUT /courses/:id - update course', async () => {
        const newCourse = {
            name: 'Introduction to Computer Science',
            professor_name: 'Dr. Jane Smith',
            limit_number_of_students: 30,
            start_date: '2024-09-01',
            end_date: '2024-12-15',
            enrolled_students: [],
        };

        const createdCourseResponse = await request(app)
            .post(`${ApiRoutes.BASE_COURSE}${ApiRoutes.CREATE_COURSE}`)
            .send(newCourse)
            .expect(StatusCode.Created);

        const courseId = createdCourseResponse.body.data._id;

        const updatedCourse = {
            ...newCourse,
            professor_name: 'Dr. John Doe',
        };

        const response = await request(app)
            .put(`${ApiRoutes.BASE_COURSE}/${courseId}`)
            .send(updatedCourse)
            .expect(StatusCode.Created);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.Created,
            message: 'Success updated course',
            data: expect.any(Object),
        });
    });

    test('DELETE /courses/:id - delete course', async () => {
        const newCourse = {
            name: 'Introduction to Computer Science',
            professor_name: 'Dr. Jane Smith',
            limit_number_of_students: 30,
            start_date: '2024-09-01',
            end_date: '2024-12-15',
            enrolled_students: [],
        };

        const createdCourseResponse = await request(app)
            .post(`${ApiRoutes.BASE_COURSE}${ApiRoutes.CREATE_COURSE}`)
            .send(newCourse)
            .expect(StatusCode.Created);

        const courseId = createdCourseResponse.body.data._id;

        const response = await request(app)
            .delete(`${ApiRoutes.BASE_COURSE}/${courseId}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: 'Success deleted course',
            data: null,
        });
    });
});
