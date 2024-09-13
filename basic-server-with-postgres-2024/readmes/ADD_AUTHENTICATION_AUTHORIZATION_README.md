## Assignment: Secure your application

**Objective:** Your task is to add jwt token-based authentication on library apis and provide authorization based on user roles.

**Requirements:**

1. **Authentication REST API (add a new REST API server) :**
- **Data Structure:** Design and implement database `users` table to store and use information about users.
- **Sign-up:** Allows user to sign-up into the system. The user role is required during registration and it can be `admin` or `normal`. It follows that:
  - `admin` user can `read/write/delete`
  - `normal` user can `read`
- **Sign-in:** Allows user to sing-in into the system and return signed jwt token with user actions.
- **Verify Jwt:** Allows your library REST API to verify if a token is valid and if it has the required actions for the called api. It's up to you choose where do the verification, it should be done even directly within your api.
- **Validation:** Implement validation checks to ensure that only valid data is accepted during sign-in and sign-up
- **Swagger API:** API documentation needs to be applied.

2. **Library REST API:**
- **Check Authentication:** Every api must verify if a user is authenticated, if not, it must return a `HTTP 401` status code
- **Check Authorization:** Every api must verify if a user is authorized to use that api, if not, it must return a `HTTP 403` status code


**Additional Notes:**

-   The private key of your jwt token must be confidential and not shared with anyone.
-   Ensure that your code follows modularization principles (auth service should be another web server).
-   Pay attention to error handling, input validation.
-   Feel free to reach out if you have any questions or need clarification on the requirements.


**Documentations:**
-  [JWT](https://jwt.io/) Debugger and docs
-  [Fastify](https://fastify.dev/docs/v4.27.x/)
-  [Fastify Validation and Serialization](https://fastify.dev/docs/v4.27.x/Reference/Validation-and-Serialization/)
-  [OpenAPI Specification](https://swagger.io/specification/) HTTP standard inteface (swagger) used to understand the capabilities of the services
-  [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core)
-  [JSON Schema Validation](https://json-schema.org/draft/2020-12/json-schema-validation). It may be useful if you need some rules on schema validation like: min length of array, string pattern, ecc..

**Achievable Points (14):**
- **Authentication REST API**:
  - Data Structure: 2 points
  - Sign-in: 2 points
  - Sign-up: 2 points
  - Verify Jwt: 2 points
  - Validation: 1 point
  - Swagger API: 1 point
- **Library REST API**:
  - Check authentication: 2 points
  - Check authorization: 2 points
