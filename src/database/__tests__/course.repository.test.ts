import mongoose from 'mongoose';
import { courseModel } from '../models/course.model';
import { CourseRepository } from '../repositories/course.repository';
import { ICourse } from '@scm/@types/course.types';
import { getConfig } from '@scm/utils/configs';



describe('CourseRepository Integration Test', () => {
  let courseRepository: CourseRepository;

  beforeAll(async () => {
    const config = getConfig();
    const uri = config.mongoUrl;
    if (!uri) {
      throw new Error('TEST_DB_URI environment variable is not set');
    }
    await mongoose.connect(uri);
    courseRepository = CourseRepository.getInstance();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await courseModel.deleteMany({});
  },10000);

  it('should create a course successfully', async () => {
    const courseData: ICourse = {
      name: 'Mathematics 101',
      professor_name: 'Dr. John Smith',
      start_date: new Date('2023-09-01'),
      end_date: new Date('2023-12-15'),
      limit_number_of_students: 30,
      enrolled_students: []
    };

    const createdCourse = await courseRepository.create(courseData);

    expect(createdCourse).toHaveProperty('_id');
    expect(createdCourse.name).toBe(courseData.name);
    expect(createdCourse.professor_name).toBe(courseData.professor_name);
  });

//   it('should throw ApiError if creation fails', async () => {
//     const courseData: ICourse = {
//       name: 'Invalid Course',
//       professor_name: 'Dr. Invalid',
//       start_date: new Date('2023-09-01'),
//       end_date: new Date('2023-12-15'),
//       limit_number_of_students: 30,
//       enrolled_students: [new ObjectId("gege")],
     
//     };

//     jest.spyOn(courseModel.prototype, 'save').mockImplementationOnce(() => {
//       throw new Error('Save failed');
//     });

//     await expect(courseRepository.create(courseData)).rejects.toThrow(ApiError);
//   });
});
