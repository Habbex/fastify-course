## Assignment: Building a REST API Server for a Library Management Application

**Objective:** Your task is to develop a REST API server for a library management application. The server should allow users to perform the following operations on books:

1.  **Create:** Add new books to the library.
2.  **Read:** Retrieve information about existing books (by id, all).
3.  **Update:** Modify details of existing books.
4.  **Delete:** Remove books from the library.

**Requirements:**

1. **Data Structure:** Design and implement a database table (with primary key) to store information about books (at least 25 books). The schema of the table must include the following fields: `title`, `author`, `isbn`, `publicationYear`.
2. **Env variables:** Store here your connection setting like: `connectionString`, `username` and `password`. Use these variable inside your application
3.  **API Endpoints:** Create REST endpoints to handle CRUD operations on books. Furthemore, the following features must be implemented on `GET /books` endpoint:
- Filter: books could be filtered by `author` and `publicationYear`.
- Sort: books could be sorted by `publicationYear` (default DESC).
- Page: the endpoint must return a paginated response with a limit of 10 books for request.
4.  **Validation:** Implement validation checks to ensure that only valid data is accepted when reading, creating or updating books. For example, ensure that the `isbn`	follows the correct format, and the `publicationYear` is within a valid range.
Implement validation even on the responses, check if the response object of each api will respect the defined json schema.
5. **Swagger API:** API documentation needs to be applied.​


**Additional Notes:**

-   Ensure that your code follows modularization principles.
-   Pay attention to error handling, input validation.
-   Feel free to reach out if you have any questions or need clarification on the requirements.
- DIY: try without installing external libraries

**PostgreSQL Configuration**

For sake of semplicity, postgresql is already installed and running as docker container. You can do operation on your database using the installed extension

![Local Image](basic-server\readme_images\postgres-extension.png)

Click on `Create Connection` and use the following setting:
- **Server Type:** PostgreSQL
- **Host:** 127.0.0.1
- **Username:** student
- **Password:** student
- **Database:** library

and then click on `Connect`.


**Documentations:**

-  [Fastify](https://fastify.dev/docs/v4.27.x/)
-  [Fastify Validation and Serialization](https://fastify.dev/docs/v4.27.x/Reference/Validation-and-Serialization/)
-  [PostgreSQL](https://www.postgresql.org/docs/14/index.html)
-  [OpenAPI Specification](https://swagger.io/specification/) HTTP standard inteface (swagger) used to understand the capabilities of the services
-  [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core)
-  [JSON Schema Validation](https://json-schema.org/draft/2020-12/json-schema-validation). It may be useful if you need some rules on schema validation like: min length of array, string pattern, ecc..

**Achievable Points (18):**
- **Data Structure**: 1 point
- **API Endpoints**:
    - POST: 2 points
    - PUT: 2 points
    - GET by id: 1 point
    - GET all: 1 point
    - DELETE: 2 points
    - Filter: 2 points
    - Sort: 2 points
    - Page: 2 points
- **Validation**: 2 points
- **Swagger API**: 1 point
