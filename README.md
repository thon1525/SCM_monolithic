
<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/vath-song99">
    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Smoeury Songvat</h3>

  <p align="center">
    School and Course Management projects!
    <br />
    <a href="https://www.postman.com/scm666-8604/workspace/scm-workspace/collection/30787235-76b903d7-4573-4c71-b72b-bee7e76297e7?action=share&creator=30787235&active-environment=30787235-f395e208-c66f-49bd-ba54-ea73b17ffa90"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.postman.com/scm666-8604/workspace/scm-workspace/collection/30787235-76b903d7-4573-4c71-b72b-bee7e76297e7?action=share&creator=30787235&active-environment=30787235-f395e208-c66f-49bd-ba54-ea73b17ffa90">View Demo</a>
    ·
    <a href="https://github.com/Vath-Song99/SCM_monolithic/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Vath-Song99/SCM_monolithic/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

### About The Project

The School and Course Management project is a comprehensive system designed to manage students and courses efficiently. It includes features such as student and course CRUD operations, search functionalities, and reporting.


### Built With

This section list any major frameworks/libraries used to bootstrap my project.

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

- ### Deployed
  *To test the deployed API, click here.*[click-here](https://www.postman.com/scm666-8604/workspace/scm-workspace/collection/30787235-76b903d7-4573-4c71-b72b-bee7e76297e7?action=share&creator=30787235&active-environment=30787235-f395e208-c66f-49bd-ba54-ea73b17ffa90)


- ### Local
  #### Prerequisites

  *This is an example of how to list things you need to use the software and how to install them.*
* npm
  ```sh
  npm install npm@latest -g
  ```
    or

* yarn
  ```sh
  npm install yarn@latest -g
  ```
### Installation

_Below is an example of how to settup the project requirement


1. Clone the repo
   ```sh
   git clone https://github.com/vath-song99/scm_monolithic.git
   ```
2. Install NPM or YARN packages
   ```sh
   npm install
   ```
   or

   ```sh
   yarn install
   ```   
3. Enter your .env variables in `configs/.env`
   ```js
    NODE_ENV=development    
    LOG_LEVEL=debug
    MONGODB_URL=your_mongodb_url
    PORT=3000
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

_Below is an example of how to get start the project!

1. START Server
   ```sh
   npm run start:dev
   ```
    or
    ```sh
   yarn start:dev
     ```
2. RUN Test
   ```sh
   npm run test
   ```
   or

   ```sh
   yarn test
   ```   
Below are some examples of how to use the API endpoints.

_For more examples, please refer to the [Documentation](https://www.postman.com/scm666-8604/workspace/scm-workspace/collection/30787235-76b903d7-4573-4c71-b72b-bee7e76297e7?action=share&creator=30787235&active-environment=30787235-f395e208-c66f-49bd-ba54-ea73b17ffa90)_

### Endpoint

### 1. Student CRUD Operations (using soft delete)

- **Create Student**: `POST /api/v1/students`
- **Retrieve Student**: `GET /api/v1/students/{id}`
- **Update Student**: `PUT /api/v1/students/{id}`
- **Delete Student (Soft Delete)**: `DELETE /api/v1/students/{id}`
- **List Students**: `GET /api/v1/students`

### 2. Student Search

- **Search Students by Full Name or Phone Number**: `GET /api/v1/students/search?query={searchTerm}`

### 3. Course CRUD Operations (using soft delete)

- **Create Course**: `POST /api/v1/courses`
- **Retrieve Course**: `GET /api/v1/courses/{id}`
- **Update Course**: `PUT /api/v1/courses/{id}`
- **Delete Course (Soft Delete)**: `DELETE /api/v1/courses/{id}`
- **List Courses**: `GET /api/v1/courses`

### 4. Course Search

- **Search Courses by Name**: `GET /api/v1/courses/search?query={searchTerm}`
- **Advanced Search Courses by Start Date and End Date**: `GET /api/v1/courses/advanced-search?start_date={startDate}&end_date={endDate}`

### 5. Register/Remove Course for Student

- **Register Course for Student**: `POST /api/v1/students/{studentId}/courses/{courseId}`
- **Remove Course for Student**: `DELETE /api/v1/students/{studentId}/courses/{courseId}`

### 6. Course Report

- **Course Report**: `GET /api/v1/courses/report`

### 7. Student Report

- **Student Report**: `GET /api/v1/students/report`


## Sample Request Body

- **Student**
```sh
    {
        "full_name_en": "John Doe",
        "full_name_km": "សុខ ស៊ីម៉ាន់",
        "date_of_birth": "1990-05-15", # format "yy,mm,dd"
        "gender": "male", # noted gender only lowercase
        "phone_number": "+855973238144",
        "courses": [
            "667fb8a1fd67fa8bce216370",
            "667fb9e20d778b0eb1a8d0db"
        ], # noted course can optionaly
    }
```

- **Course**
```sh
    {
        "name": "Introduction to Computer Science",
        "professor_name": "Dr. Jane Smith",
        "limit_number_of_students": 30,
        "start_date": "2024-09-01",
        "end_date": "2024-12-15",
        "enrolled_students": [
            "667f9b5d608df88473d6dc1a",
            "667fbc0c2ee96d8d99d0b68e"
        ], # noted enrolled_students can be optionaly 
    }
```
  
## Sample Response Body

- **Student**
```sh
    {
        "_id": "667fbc0c2ee96d8d99d0b68e",
        "full_name_en": "John Doe",
        "full_name_km": "សុខ ស៊ីម៉ាន់",
        "date_of_birth": "1990-05-15T00:00:00.000Z",
        "gender": "male",
        "phone_number": "+855973238144",
        "courses": [
            "667fb8a1fd67fa8bce216370",
            "667fb9e20d778b0eb1a8d0db"
        ],
        "is_deleted": false,
        "create_at": "2024-06-29T07:47:24.711Z",
        "__v": 3
    }
```

- **Course**
```sh
    {
        "_id": "667fb9e20d778b0eb1a8d0db",
        "name": "Introduction to Computer Science",
        "professor_name": "Dr. Jane Smith",
        "limit_number_of_students": 30,
        "start_date": "2024-09-01T00:00:00.000Z",
        "end_date": "2024-12-15T00:00:00.000Z",
        "enrolled_students": [
            "667f9b5d608df88473d6dc1a",
            "667fbc0c2ee96d8d99d0b68e"
        ],
        "is_deleted": false,
        "create_at": "2024-06-29T07:38:10.361Z",
        "__v": 1
    }
```
### Validation

**Student Document Validation**:

1. `full_name_en`: Must be a non-empty string.
2. `full_name_km`: Must be a non-empty string.
3. `date_of_birth`: Must be a valid date.
4. `gender`: Must be either "male", "female", or “other” valid options.
5. `phone_number`: Must be a valid phone number format .
6. `courses` :  Must be an array of valid course IDs. The string of IDs should not exceed

**Course Document Validation**:

1. `name`: Must be a non-empty string.
2. `professor_name`: Must be a non-empty string.
3. `limit_number_of_students`: Must be a positive integer.
4. `start_date`: Must be a valid date.
5. `end_date`: Must be a valid date and must be after `start_date`.
6. `enrolled_students`: Must be an array of valid student IDs. The string of IDs should not exceed .

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Smoeury Songvat - [@Songvat](https://www.linkedin.com/in/smoeury-songvat-a79aa0261/) - songvatsmoeury@gmail.com

Project Link: [https://github.com/vath-song99/scm_monolithic](https://github.com/vath-song99/scm_monolithic)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/scm_monolithic?style=for-the-badge
[contributors-url]: https://github.com/vath-song99/scm_monolithic/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vath-song99/scm_monolithic.svg?style=for-the-badge
[forks-url]: https://github.com/vath-song99/scm_monolithic/network/members
[stars-shield]: https://img.shields.io/github/stars/vath-song99/scm_monolithic.svg?style=for-the-badge
[stars-url]: https://github.com/vath-song99/scm_monolithic/stargazers
[issues-shield]: https://img.shields.io/github/issues/vath-song99/scm_monolithic.svg?style=for-the-badge
[issues-url]: https://github.com/vath-song99/scm_monolithic/issues
[license-shield]: https://img.shields.io/github/license/vath-song99/scm_monolithic.svg?style=for-the-badge
[license-url]: https://github.com/vath-song99/scm_monolithic/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/vath-song99#   S C M _ m o n o l i t h i c  
 