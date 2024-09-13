## Assignment: Add PostgreSQL

**Objective:** Your task is to add postgresql plugin and modify your route in order to do the following operations on database:

1.  **Create:** Add new books to the library.
2.  **Read:** Retrieve information about existing books.
3.  **Update:** Modify details of existing books.
4.  **Delete:** Remove books from the library.

**Requirements:**

1.  **Data Structure:** Design and implement a database table (with primary key) to store information about books (at least 25 books). The schema of the table must include the following fields: `title`, `author`, `isbn`, `publicationYear`.
2. **Env variables:** Store here your connection setting like: `connectionString`, `username` and `password`. Use these variable inside your application
3.  **REST API Endpoints:** Modify your endpoints to use postgresql connection. Do your CRUD operations using your database as storage medium instead of having in-memory variable.


**Additional Notes:**

-   Ensure that your code follows modularization principles.
-   Pay attention to error handling, input validation.
-   Feel free to reach out if you have any questions or need clarification on the requirements.

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
-  [PostgreSQL](https://www.postgresql.org/docs/14/index.html)
-  [OpenAPI Specification](https://swagger.io/specification/) HTTP standard inteface (swagger) used to understand the capabilities of the services
-  [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core)
-  [JSON Schema Validation](https://json-schema.org/draft/2020-12/json-schema-validation). It may be useful if you need some rules on schema validation like: min length of array, string pattern, ecc..


**Achievable Points (10):**
- **Data Structure**: 1 point
- **Env Variables**: 1 point
- **REST API Endpoints**:
    - POST: 1 point
    - PUT: 1 point
    - GET by id: 1 point
    - GET all: 1 point
    - DELETE: 1 point
    - Filter: 1 point
    - Sort: 1 point
    - Page: 1 point
