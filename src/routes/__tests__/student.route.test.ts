import request from 'supertest';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import { StatusCode } from '@scm/utils/consts';
import studentRouter from '../student.routes';
import { getConfig } from '@scm/utils/configs';
import { ApiRoutes } from '..';
import courseRouter from '../course.routes';


const config = getConfig()

describe('Student API Routes', () => {
    let app: Application;
    const testDbUri = config.mongoUrl; 

    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(testDbUri!);

        app = express();
        app.use(express.json());
        app.use(ApiRoutes.BASE_STUDENT,studentRouter);
        app.use(ApiRoutes.BASE_COURSE,courseRouter);
    });

    afterAll(async () => {
        // Close the database connection
        // Clean up the database between tests
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        await mongoose.connection.close();
    });

    test('POST /students - create student', async () => {
        const newStudent = {
            full_name_en: 'John Doe',
            full_name_km: 'ជុន ដូ',
            date_of_birth: '2000-01-01',
            gender: 'male',
            phone_number: '+855123456789',
            courses: [],
        };

        const response = await request(app)
            .post('/api/v1/students')
            .send(newStudent)
            .expect(StatusCode.Created);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.Created,
            message: "Success create new student",
            data: expect.objectContaining(response.body.data),
        });
    });

    test('GET /students/report - get students report', async () => {
        const response = await request(app)
            .get('/api/v1/students/report')
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success get report for student",
            data: expect.any(Array),
        });
    });

    test('GET /students/search - search students', async () => {
        const searchTerm = 'John Doe';
        const response = await request(app)
            .get('/api/v1/students/search')
            .query({ query: searchTerm })
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success search student",
            data: expect.any(Array),
        });
    });

    test('GET /students - list students', async () => {
        const response = await request(app)
            .get('/api/v1/students')
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success retrieved students",
            data: expect.any(Array),
        });
    });

    test('GET /students/:id - retrieve student', async () => {
        const newStudent = {
            full_name_en: 'John Doe',
            full_name_km: 'ជុន ដូ',
            date_of_birth: '2000-01-01',
            gender: 'male',
            phone_number: '123456789',
            courses: [],
        };

        const createdStudentResponse = await request(app)
            .post('/api/v1/students')
            .send(newStudent)
            .expect(StatusCode.Created);

        const studentId = createdStudentResponse.body.data._id;

        const response = await request(app)
            .get(`/api/v1/students/${studentId.toString()}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success retrieved student",
            data: expect.any(Object),
        });
    });

    test('PUT /students/:id - update student', async () => {
        const newStudent = {
            full_name_en: 'Song vich',
            full_name_km: 'សង្វិច',
            date_of_birth: '2000-01-01',
            gender: 'male',
            phone_number: '+8551234568',
            courses: [],
        };

        const createdStudentResponse = await request(app)
            .post('/api/v1/students')
            .send(newStudent)
            .expect(StatusCode.Created);

        const studentId = createdStudentResponse.body.data._id;

        const updatedStudent = {
            ...newStudent,
            phone_number: '987654321',
        };

        const response = await request(app)
            .put(`/api/v1/students/${studentId}`)
            .send(updatedStudent)
            .expect(StatusCode.Created);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.Created,
            message: "Success updated student",
            data: expect.any(Object),
        });
    });

    test('DELETE /students/:id - delete student', async () => {
        const newStudent = {
            full_name_en: 'en dear',
            full_name_km: 'dolar',
            date_of_birth: '2000-01-01',
            gender: 'male',
            phone_number: '+855094736',
            courses: [],
        };

        const createdStudentResponse = await request(app)
            .post('/api/v1/students')
            .send(newStudent)
            .expect(StatusCode.Created);

        const studentId = createdStudentResponse.body.data._id;

        const response = await request(app)
            .delete(`/api/v1/students/${studentId}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success deleted student",
            data: null,
        });
    });

    test('POST /students/:studentId/courses/:courseId - register course for student', async () => {
        const newStudent = {
            full_name_en: 'Doul kor',
            full_name_km: 'ជុន ដូ',
            date_of_birth: '2000-01-01',
            gender: 'male',
            phone_number: '+855123990',
            courses: [],
        };

        const createdStudentResponse = await request(app)
            .post('/api/v1/students')
            .send(newStudent)
            .expect(StatusCode.Created);

        const studentId = createdStudentResponse.body.data._id;

        const newCourse = {
        name: "Introduction to Computer Science",
        professor_name: "Dr. Jane Smith",
        limit_number_of_students: 30,
        start_date: "2024-09-01",
        end_date: "2024-12-15",
        enrolled_students: []
        };

        const createdCourseResponse = await request(app)
            .post('/api/v1/courses')
            .send(newCourse)
            .expect(StatusCode.Created);

        const courseId = createdCourseResponse.body.data._id;

        const response = await request(app)
            .post(`/api/v1/students/${studentId}/courses/${courseId}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success registed student",
            data: expect.objectContaining({
                _id: studentId,
                courses: expect.arrayContaining([courseId]),
            }),
        });
    });

    test('DELETE /students/:studentId/courses/:courseId - remove course for student', async () => {
        const newStudent = {
            full_name_en: 'searpohai',
            full_name_km: 'ជុន ដូ',
            date_of_birth: '2000-01-01',
            gender: 'male',
            phone_number: '+85512345853',
            courses: [],
        };

        const createdStudentResponse = await request(app)
            .post('/api/v1/students')
            .send(newStudent)
            .expect(StatusCode.Created);

        const studentId = createdStudentResponse.body.data._id;

        const newCourse = {
            name: "Introduction to Mathematics",
            professor_name: "Dr. Jane Smith",
            limit_number_of_students: 30,
            start_date: "2024-09-01",
            end_date: "2024-12-15",
            enrolled_students: []
            };

        const createdCourseResponse = await request(app)
            .post('/api/v1/courses')
            .send(newCourse)
            .expect(StatusCode.Created);

        const courseId = createdCourseResponse.body.data._id;

        await request(app)
            .post(`/api/v1/students/${studentId}/courses/${courseId}`)
            .expect(StatusCode.OK);

        const response = await request(app)
            .delete(`/api/v1/students/${studentId}/courses/${courseId}`)
            .expect(StatusCode.OK);

        expect(response.body).toEqual({
            success: true,
            statusCode: StatusCode.OK,
            message: "Success deleted course for student",
            data: expect.objectContaining({
                _id: studentId,
                courses: expect.not.arrayContaining([courseId]),
            }),
        });
    },30000);
});
