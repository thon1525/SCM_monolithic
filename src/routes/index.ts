export enum ApiRoutes {
  // Base
  BASE_STUDENT =  '/api/v1/students',
  BASE_COURSE =  '/api/v1/courses',
  // Student CRUD Operations
  CREATE_STUDENT = '/',
  RETRIEVE_STUDENT = '/:id',
  UPDATE_STUDENT = '/:id',
  DELETE_STUDENT = '/:id',
  LIST_STUDENTS = '/',

  // Student Search
  SEARCH_STUDENTS = '/search',

  // Course CRUD Operations
  CREATE_COURSE = '/',
  RETRIEVE_COURSE = '/:id',
  UPDATE_COURSE = '/:id',
  DELETE_COURSE = '/:id',
  LIST_COURSES = '/',

  // Course Search
  SEARCH_COURSES = '/search',
  ADVANCED_SEARCH_COURSES = '/advanced-search',

  // Register/Remove Course for Student
  REGISTER_COURSE_FOR_STUDENT = '/:studentId/courses/:courseId',
  REMOVE_COURSE_FOR_STUDENT = '/:studentId/courses/:courseId',

  // Course Report
  COURSE_REPORT = '/report',

  // Student Report
  STUDENT_REPORT = '/report'
}
