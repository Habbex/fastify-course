## Assignment: Unit and Integration Testing

**Objective:** Your task is to implement the following types of tests in our application:

1.  **Unit Test**
2.  **Integration Test**

**Requirements:**

1.  **Data Structure:** Create a new `test` database in order to do the integration testing.
2.  **Auth REST API:** Add testing on our auth apis. It's up to you define when to use `Unit` or `Integration` testing.
3.  **Library REST API:** Add testing on library apis. It's up to you define when to use `Unit` or `Integration` testing.


**Additional Notes:**

-   Ensure that your code follows modularization principles.
-   Feel free to reach out if you have any questions or need clarification on the requirements.

**PostgreSQL TEST Configuration**

For sake of semplicity, postgresql is already installed and running as docker container. You can do operation on your database using the installed extension

![Local Image](basic-server\readme_images\postgres-extension.png)

Click on `Create Connection` and use the following setting:
- **Server Type:** PostgreSQL
- **Host:** 127.0.0.1
- **Username:** student
- **Password:** student
- **Database:** test

and then click on `Connect`.


**Documentations:**

-  [Fastify](https://fastify.dev/docs/v4.27.x/)
-  [Fastify Testing](https://fastify.dev/docs/latest/Guides/Testing/)
-  [PostgreSQL](https://www.postgresql.org/docs/14/index.html)
-  [Jest](https://jestjs.io/)

**Achievable Points (9):**
- **Data Structure**: 1 point
- **Auth REST API**:
    - Sign-in: 1 point
    - Sign-up: 1 point
    - Verify Jwt: 1 point
- **Library REST API**:
    - POST: 1 point
    - PUT: 1 point
    - GET by id: 1 point
    - GET all: 1 point
    - DELETE: 1 point
