import mongoose from 'mongoose';
import { studentModel } from '../models/student.model';
import { StudentRepository } from '../repositories/student.repository';
import { IStudent } from '@scm/@types/student.types';
import { ApiError } from '@scm/errors/api-error';
import { getConfig } from '@scm/utils/configs';

describe('StudentRepository Integration Test', () => {
  let studentRepository: StudentRepository;

  beforeAll(async () => {
    const config = getConfig()
    const uri = config.mongoUrl;
    if (!uri) {
      throw new ApiError('TEST_DB_URI environment variable is not set');
    }
    await mongoose.connect(uri);
    studentRepository = StudentRepository.getInstance();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await studentModel.deleteMany({});
  },10000);

  it('should create a student successfully', async () => {
    const studentData: IStudent = {
      full_name_en: 'John Doe',
      full_name_km: 'សុខ ចាន់ដេត',
      date_of_birth: new Date('2000-01-01'),
      gender: "male",
      phone_number: '123456789',
      courses: []
    };

    const createdStudent = await studentRepository.create(studentData);

    expect(createdStudent).toHaveProperty('_id');
    expect(createdStudent.full_name_en).toBe(studentData.full_name_en);
    expect(createdStudent.full_name_km).toBe(studentData.full_name_km);
  });

  // it('should throw ApiError if creation fails', async () => {
  //   const studentData: IStudent = {
  //     full_name_en: 'Invalid Student',
  //     full_name_km: 'សិទ្ធិ មុន្នី',
  //     date_of_birth: new Date('2000-01-01'),
  //     gender: 'male',
  //     phone_number: '987654321',
  //     courses: []
  //   };

  //   jest.spyOn(studentModel.prototype, 'save').mockImplementationOnce(() => {
  //     throw new Error('Save failed');
  //   });

  //   await expect(studentRepository.create(studentData)).rejects.toThrow(ApiError);
  // });
});
