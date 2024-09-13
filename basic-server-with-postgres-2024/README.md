# Node.js Library Project

This project is a Fastify-based web application with authentication and library management features. It includes integration tests and unit test, and uses PostgreSQL as it's database.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Docker (optional, for running the database in a container)

## Setup

### 1. Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies
```sh
npm install
```
### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```
POSTGRES_DB_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/library
POSTGRES_TEST_DB_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/library_test
JWT_SECRET=secret
TEST_TOKEN={Run the auth server and generate a admin user} 
WEB_APP_HOST_PORT=3000
AUTH_APP_HOST_PORT=3001
```

### 4. Set Up the Database
 - Option 1: Using Docker
    ```
    docker-compose up -d
    ```
 - Option 2: Manually
 Ensure you have PostgreSQL running locally and create the required databases:
    ```
        psql -U postgres -c "CREATE DATABASE library;"

        psql -U postgres -c "CREATE DATABASE library_test;"
    ```

### 5. Run Migrations
Apply the initial database schema:
```
psql -U postgres -d library -f migrations/init.sql
```  

## Running the Application

### 1. Start the Application

To start both the web and auth applications, run:

```sh
npm start
```

### 2. Development Mode

To start the application in development mode with hot-reloading, run:

```sh
npm run dev
```

## Running Tests

To run the tests, use:

```sh
npm test
```

To run tests in watch mode:

```sh
npm run test:watch
```

## Project Structure

- `src/`: Contains the source code for the application.
  - `auth/`: Authentication-related code.
    - `app.js`: Fastify app setup for authentication.
    - `routes/auth.js`: Authentication routes.
    - `schema/auth.js`: Authentication schemas.
    - `server.js`: Server setup for the authentication app.
  - `library/`: Library management-related code.
    - `app.js`: Fastify app setup for the library.
    - `routes/v1/books.js`: Book routes.
    - `routes/v1/dbCheck.js`: Database health check routes.
    - `schemas/v1/books.js`: Book schemas.
    - `server.js`: Server setup for the library app.
    - `validations/ibsn.js`: ISBN validation.
  - `config/env.js`: Environment variable configuration.
  - `index.js`: Main entry point to start both apps.
- `__int_tests__/`: Integration tests.
  - `auth.test.js`: Tests for authentication.
  - `books.test.js`: Tests for books.
  - `setupTestApp.js`: Setup for library tests.
  - `setupTestAuthApp.js`: Setup for authentication tests.
- `__tests__/`: Unit tests.
  - `isbn.test.js`: Tests for ISBN validation.
- `migrations/`: Database migration scripts.
  - `init.sql`: Initial database schema.
- `apiCollections/`: HTTP request collections for testing APIs.
  - `books.http`: HTTP requests for book APIs.

## License
```
This project is licensed under the MIT License.
```

