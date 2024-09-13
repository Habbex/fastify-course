# Basic Server with Postgres Course

This guide explains how to create a simple web application using Node.js and the Fastify.js framework, connected to a PostgreSQL database.

---

## Prerequisites

- **Node.js** and **npm** installed on your machine.
- Basic knowledge of JavaScript and Fastify.
- A **PostgreSQL** database instance.
- **Git** for version control.

---

## Step 1: Create a Git Repository

1. Initialize a new Git repository to version control your code.
2. Clone the repository to your development machine.

---

## Step 2: Setup the Project

1. Run `npm init` and accept the default options to initialize a new Node.js project.
2. Install **nodemon** as a development dependency for easier development:
    ```bash
    npm i nodemon --save-dev
    ```
3. Install **Fastify**:
    ```bash
    npm i fastify --save
    ```
    
---

## Step 3: Create Your First Server

1. Create a `src` folder to contain all your code.
2. Inside the `src` folder, create a `server.js` file.
3. In `server.js`, initialize Fastify with a logger:
    ```js
    const fastify = require('fastify')({
        logger: true
    });
    ```
4. Declare a simple GET route:
    ```js
    fastify.get('/', (request, reply) => {
        reply.send({ hello: 'world' });
    });
    ```
5. Start the server by listening on port 3000:
    ```js
    fastify.listen({ port: 3000, host: 'localhost' }, (err) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
    ```

6. Add the following npm scripts to your `package.json` to run the server with **nodemon**:
    ```json
    "scripts": {
      "dev": "nodemon src/server.js",
      "start": "node src/server.js"
    }
    ```

7. Run the development server:
    ```bash
    npm run dev
    ```

8. The server should now be running on `http://localhost:3000`.

---

## Step 4: Test Your API

1. Install the **REST Client** extension in VS Code for easy API testing.
2. Create a `test` folder in the project root and add a `test.http` file.
3. In `test.http`, add the following test request:
    ```http
    ### GET
    GET http://127.0.0.1:3000 HTTP/1.1
    ```
4. Send the request using the REST Client and verify the response:
    ```json
    { "hello": "world" }
    ```

---

## Step 5: Modularizing the Application (Part 1)

1. Create a new `app.js` file in the `src` folder to manage routes and plugins.
2. Move Fastify initialization into `app.js` and create a `build` function:
    ```js
    const fastify = require('fastify');

    const build = (opts = {}) => {
        const app = fastify(opts);
        return app;
    };

    module.exports = { build };
    ```

3. In `server.js`, import the `build` function and update the code:
    ```js
    const { build } = require("./app");

    const app = build({ logger: true });

    app.get("/", (request, reply) => {
        return { hello: "world" };
    });

    app.listen({ port: 3000, host: 'localhost' }, (err) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
    });
    ```

---

## Step 6: Modularizing the Application (Part 2)

1. Organize routes by creating a `routes/v1/books.js` file inside the `src` folder:
    ```js
    const booksRoutes = async (fastify) => {
        fastify.get('/', async (request, reply) => {
            return { hello: "world" };
        });
    };

    module.exports = { booksRoutes };
    ```

2. Register the new route in `app.js`:
    ```js
    const { booksRoutes } = require('./routes/v1/books');

    const build = (opts = {}) => {
        const app = fastify(opts);
        app.register(booksRoutes);
        return app;
    };

    module.exports = { build };
    ```
---

## Step 7: Adding Fastify Swagger Plugin

Swagger provides interactive API documentation. To integrate Swagger with Fastify:

1. Stop the running server (`Ctrl + C`).
2. Install Swagger plugins:
    ```bash
    npm i @fastify/swagger @fastify/swagger-ui
    ```

3. In `app.js`, import and register the Swagger plugins:
    ```js
    const fastifySwagger = require('@fastify/swagger');
    const fastifySwaggerUI = require('@fastify/swagger-ui');

    const build = (opts = {}, optsSwagger = {}, optsSwaggerUI = {}) => {
        const app = fastify(opts);

        app.register(fastifySwagger, optsSwagger);
        app.register(fastifySwaggerUI, optsSwaggerUI);
        app.register(booksRoutes);

        return app;
    };

    module.exports = { build };
    ```

4. Update `server.js` to configure Swagger:
    ```js
    const app = build(
        { logger: true },
        {
            openapi: {
                openapi: '3.0.0',
                info: {
                    title: 'Test Swagger',
                    description: 'Testing the Fastify Swagger API',
                    version: '0.1.0',
                },
                servers: [
                    {
                        url: 'http://localhost:3000',
                        description: 'Development server',
                    },
                ],
            },
        },
        {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'full',
                deepLinking: false,
            },
        }
    );
    ```

5. You can now view the Swagger documentation at `http://localhost:3000/docs`.

---


## Step 8: Connect your application to a PostgreSQL database

1. Setup Postgres database:
    - Option 1: Using Docker
        ```
        docker-compose up -d
        ```
    - Option 2: Manually
    Ensure you have PostgreSQL running locally or on codespaces and create the required database:
        ```
            psql -U postgres -c "CREATE DATABASE library;"
        ```

2. Install Postgres(`pg`) and fastify postgres plugin:
    ```bash
        npm i pg @fastify/postgres
    ```

3. In `app.js`, import and register the Postgres plugins:
    ```js
    //....other imports
    const fastifyPostgres= require('@fastify/postgres')

    const build = (opts = {}, optsSwagger = {}, optsSwaggerUI = {}, optsPostgres={}) => {
        const app = fastify(opts);

        app.register(fastifySwagger, optsSwagger);
        app.register(fastifySwaggerUI, optsSwaggerUI);

        app.register(fastifyPostgres, optsPostgres)
        app.register(booksRoutes);

        return app;
    };

    module.exports = { build };
    ```
4. Update `server.js` to configure Postgres:
    ```js
    const app = build(
        { logger: true },
        {
            openapi: {
                openapi: '3.0.0',
                info: {
                    title: 'Test Swagger',
                    description: 'Testing the Fastify Swagger API',
                    version: '0.1.0',
                },
                servers: [
                    {
                        url: 'http://localhost:3000',
                        description: 'Development server',
                    },
                ],
            },
        },
        {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'full',
                deepLinking: false,
            },
        },
        { 
            connectionString: "postgres://postgres:postgres@localhost:5432/library"
        }
    );
    ```

5. Create a new routes files called `healthCheck.js`:
    ```js
    const healthCheck= async (fastify) => {
        fastify.get("/", async (request, reply) => {
            const client = await fastify.pg.connect()
            try {
                const {rows} = await client.query("SELECT now()")
                reply.send(rows[0])
            } catch (error) {
                reply.code(500).send("Error connecting to database")
            }finally{
                client.release()
            }
        })
    }
    
    module.exports = healthCheck 
    ```

6. Register the new route in `app.js`.

    Notice the prefix part when registering the new route, this is a good way to differentiate between the different routes. 
    ```js
        //....other imports
            const healthCheck = require('./routes/v1/healthCheck')

            const build = (opts = {}, optsSwagger = {}, optsSwaggerUI = {}, optsPostgres={}) => {
                const app = fastify(opts);

                app.register(fastifySwagger, optsSwagger);
                app.register(fastifySwaggerUI, optsSwaggerUI);

                app.register(fastifyPostgres, optsPostgres)
                app.register(booksRoutes);
                app.register(dbCheck, {prefix: '/healthcheck'})

                return app;
            };

            module.exports = { build };
    ```
7.  In `test.http`, add the following test request:
    ```http
    ### GET
    GET http://127.0.0.1:3000/healthcheck HTTP/1.1
    ```
8. Send the request using the REST Client and verify the response is returning the current time from the Postgres Database:
    ```json
    {
        "now": "2024-09-06T11:41:56.495Z"
    }
    ```

## Step 9: Populate PostgreSQL database
1. Use the SQL file `/migrations/init.sql`,which contains SQL commands to populate the database.

2. Run following SQL command to create a table called `books`:
    ```sql
    -- Check if the 'books' table exists, create it if it does not
    CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(13),
        published_year INT
    );
    ```
3. Run the following SQL commands to popluate the `books` table with 25 books:
    ```sql
        -- Insert books into the 'books' table
    INSERT INTO books (title, author, isbn, published_year) VALUES
        ('Don Quixote', 'Miguel de Cervantes', '9780060934347', 1605),
        ('The Divine Comedy', 'Dante Alighieri', '9780140448955', 1320),
        ('Macbeth', 'William Shakespeare', '9780743477109', 1623),
        ('The Prince', 'Niccolò Machiavelli', '9780199535699', 1532),
        ('The Republic', 'Plato', '9780140455113', -380),
        ('One Hundred Years of Solitude', 'Gabriel García Márquez', '9780060883287', 1967),
        ('War and Peace', 'Leo Tolstoy', '9780199232765', 1869),
        ('Moby-Dick', 'Herman Melville', '9780142437247', 1851),
        ('Ulysses', 'James Joyce', '9780199535675', 1922),
        ('In Search of Lost Time', 'Marcel Proust', '9780141180341', 1913),
        ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925),
        ('The Iliad', 'Homer', '9780140447941', -750),
        ('Crime and Punishment', 'Fyodor Dostoevsky', '9780140449136', 1866),
        ('The Odyssey', 'Homer', '9780140268867', -725),
        ('The Brothers Karamazov', 'Fyodor Dostoevsky', '9780374528379', 1880),
        ('Pride and Prejudice', 'Jane Austen', '9780141439518', 1813),
        ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960),
        ('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 1951),
        ('The Canterbury Tales', 'Geoffrey Chaucer', '9780140424386', 1400),
        ('Les Misérables', 'Victor Hugo', '9780451419439', 1862),
        ('Anna Karenina', 'Leo Tolstoy', '9780140449174', 1877),
        ('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 1937),
        ('Fahrenheit 451', 'Ray Bradbury', '9781451673319', 1953),
        ('The Lord of the Rings', 'J.R.R. Tolkien', '9780544003415', 1954),
        ('Harry Potter and the Philosophers Stone', 'J.K. Rowling','9781408855652', 1997);
    ```
## Step 10: Install enviroment variable handling 
1. Install `dotenv` to get enviroment variable, and `envalid` to validate the if the enviroment variable are present.
    ```bash
    npm i dotenv envalid
    ```
2. Create a `.env` file and add the connectionstring of PostgresSQL and other variables.
    ```bash
    POSTGRES_DB_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/library
    ```
3. Create a new file under the following path: `config/env.js`:
    ```js
    require('dotenv').config()

    const envaild = require('envalid')

    module.exports = envaild.cleanEnv(process.env, {
        POSTGRES_DB_CONNECTION_STRING : envaild.str({}),
        POSTGRES_TEST_DB_CONNECTION_STRING : envaild.str({}),
        JWT_SECRET: envaild.str({}),
        TEST_TOKEN: envaild.str({}),
        WEB_APP_HOST_PORT: envaild.num({default:8080}),
        AUTH_APP_HOST_PORT: envaild.num({default:8081})
    })
    ``` 
4. Import the `env.js` in the `server.js`:
    ```js
    const env = require("../config/env")
    const app = build_web_app(
    { logger: true },
    { connectionString: env.POSTGRES_DB_CONNECTION_STRING },
    //....
    ```
## Step 11: Create GET by id and GET all books route
1. Update the `GET` route inside of `books.js`:
    ```js
      fastify.get('/', async (request, reply) => {
        // connect to Postgres
        const client = await fastify.pg.connect() 
        try {
            // query the database
            // Note: avoid doing expensive computation here, this will block releasing the client
            const { rows } = await client.query("SELECT * FROM books") 
            reply.send(rows)
        } catch (error) { 
            // error handling
            console.error("Error getting books", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally {
            // Release the client immediately after query resolves, or upon error
            client.release() 
        }
    ```
2. Create a new route to `GET by id` inside of `book.js`:
    ```js
    fastify.get("/:id", async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const { id } = request.params;
            const { rows } = await fastify.pg.query(
                "SELECT * FROM books WHERE id=$1",
                [id] 
            );
            reply.send(rows[0]);
        } catch (err) {
            reply.send(err);
        } finally {
            client.release();
        }
    });
    ```
    ### SQL injections
    Worth mentioning that you should avoid using string interpolation (with backtick's ``) when creating our queries , as the example below :
    ```js
    `SELECT * items WHERE id=${id}`
    ```
    Since it exposes the route and the database for injected SQL queries that would cause major damage to your system such as this example :
    ```http
    ### UPDATE ITEM
    PUT http://localhost:3000/v1/books/1 HTTP/1.1
    Content-Type: application/json

    {
     "id" : "x\\';DROP TABLE temptable; --"
     ...
     ...
    }
    ```

    You should always pass in values as parameters to the query, such as we have done in this session:

    ```js
    const { rows } = await fastify.pg.query(
                    "UPDATE books SET title=$1, author=$2, isbn=$3, published_year=$4 WHERE id=$5 RETURNING *",
                    [title, author, isbn, published_year, id]
                )
    ```

3. Test the new routes by updating the `test.http` with the following tests:

    ```http
    ### GET ALL books
    GET http://127.0.0.1:3000/books HTTP/1.1
    ```
    ```http
    ### GET book by id
    GET http://127.0.0.1:3000/books/1 HTTP/1.1
    ```

## Step 12: Validation and schema
One of the strong suit of fastify is its handling of validation and schemas , which basically allows us to format the responses which we get from each of the calls. It allows us to validate the request body to ensure we are receiving the correct information.

This is done by creating an object containing information on how the response needs to look like, and what validations it requires.

1. We create a new folder called `schemas.js`, and inside of this we add the following:
    ```js
    const book = {
    type: 'object',
        properties: {
            id: {type: 'integer'},
            title: { type: 'string' },
            author: { type: 'string' },
            isbn: { type: 'string' },
            published_year: { type: 'number' }

        }
    }

    const bookNotFoundResponse = {
        type: 'object',
        properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
        },
        example: {
            statusCode: 404,
            error: "Not Found",
            message: "The book you r are looking for does not exist"
        }
    }

    const getBookOpts = {
        response: {
            200: book,
            404: bookNotFoundResponse
        }
    }


    const getBooksOpts = {
        response: {
            200: {
                type: 'array',
                items: book
            }
        }
    }

    module.exports = { getBooksOpts, getBookOpts }
    ```
2. Import the two schema opts into `book.js` routes file ,and update the routes:
    ```js
    const { getBooksOpts, getBookOpts } = require("../../schemas/v1/books")
    // code
    fastify.get('/', getBooksOpts, async (request, reply) => {

    fastify.get('/:id', getBookOpts, async (request, reply) => {
    ```
3. Test the routes from `test.http`, or via Swagger documentation url (notice that it's also updated to reflect the schema)

## 12. Celebrate you achivement 🥳
Good job you have completed the basic setup of the server!


## 13. Add Unit testing
1. First we download and install the testing framework *JEST* with `npm i jest --save-dev`.

2. Update the `package.json` file and add to new npm script commands:
    ```json
    "test": "jest --coverage --runInBand"
    "test:watch": "jest --watch --runInBand"
    ```
    `npm run test`: Runs the **JEST** test once and closes down the process once it's done.
    `npm run test:watch`: Runs **JEST** in watch mode and reruns the tests if while working on the code.


3. Let's work in TDD mode where we first develop the test then the actual implementation, so we create a new folder called `__test__` and inside it we create a new file called `isbn.test.js`:
    ```js
        describe("vaidateIsbn", ()=>{
        it("should return true if the length is 13 digits ISBN-13", ()=>{
            //arrange
            const testIsbn = "9780060934348"
            // act
            const result= validateIsbn(testIsbn)
            //assets
            expect(result).toBe(true)
        })

        it("should return true if the length is 10 digits for ISBN-10", ()=>{
            //arrange
            const testIsbn = "1234567891"
            // act
            const result= validateIsbn(testIsbn)
            //assets
            expect(result).toBe(true)
        })

        it("should return false if the length is less than 10 digits", ()=>{
            //arrange
            const testIsbn = "123456789"
            // act
            const result= validateIsbn(testIsbn)
            //assets
            expect(result).toBe(false)
        })
    })
    ```
    **ISBN**: Is store in different format, but we are only looking for if it's lenght is either 10 digits or 13 digits. 

4. Create the function that we have written test to inside a new path `validations/isbn.js`:

    ```js
    const validateIsbn= (isbn)=> {
        const isbnLength= isbn.length
        if (isbnLength === 10 || isbnLength === 13) {
            return true
        }
        return false
    }

    module.exports= validateIsbn
    ``` 
5. Update the code inside of `books.js` route file, and add the validation code in all routes that reviecies isbn in their body payload. 
    ```js
    // POST or PUT code
    if (!validateIsbn(isbn)) {
                reply.code(400).send({ error: "ISBN should either be 10 or 13 digits long" })
            }
    ``` 

## 14. Add Integration testing
1. Then we create a new folder next to `src` folder , and we call it `__int_tests__` which is `__int + __test__` based on how *Jest* looks for test files. 

2. Inside the folder we create a new javaScript file called `setupTestApp.js`, which we'll setup a test setup of our environment:
    ```js
    const build_web_app = require("../src/library/app");

    const env = require("../src/config/env");

    const createTableSQL =
        `CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(13),
        published_year INT
    );`

    const insertFakeItemSQL =
        `INSERT INTO books (title, author, isbn, published_year) VALUES
        ('Test Title 1', 'Test author', '1234567891', 2020)`;


    const clearTableSQL = "TRUNCATE TABLE books"

    module.exports = function setupTestApp() {
        const app = build_web_app(
            {
                logger: true,
            },
            {
                connectionString: env.POSTGRES_TEST_DB_CONNECTION_STRING, // connect to test database
            },
            {
                secret: env.JWT_SECRET,
            }
        
        );

        beforeAll(async () => {
            await app.ready();
            await app.pg.query(createTableSQL);
        });

        beforeEach(async ()=>{
            await app.pg.query(insertFakeItemSQL);
        })

        afterEach(async () => {
            await app.pg.query(clearTableSQL);
        });

        afterAll(async () => {
            await app.pg.query(clearTableSQL);
            app.close();
        });

        return app;
    };
    ```
Remember in the beginning when we decided to modularize our application , it's to easily use the same build function when running our integration test. 

3. We'll update our `config/env.js` file and give it a new environment variable of a postgres DB connection string pointing to a temp database which we'll create by running : 
`Create DATABASE library_test`.

4. The temp database will serve as our test database which we will test all our CRUD endpoints towards. 

5. Often while writing tests you have some setup work that needs to happen before tests run, and you have some finishing work that needs to happen after tests run like `beforeEach` or `afterEach` hooks. 

Some test we only need to do the setup once like for `beforeAll` or `AfterAll` hooks. 

- For us we'll create a test table `beforeAll` test, and we clear the table just to be sure. 
- `beforeEach` test we'll insert a fake entry of an book which we can use in our integration tests. 

- `afterEach` test we'll clear the test table.

- `afterAll` test we'll clear the test table, when the test's are done. We teardown the setup by calling `await app.close();`

6. Now we'll move on to create our integration test by creating a new javaScript and call it `book.test.js`:
    ```js
    const setupTestApp = require("./setupTestApp");
    const env = require("../src/config/env")
    const testToken= "Bearer " + env.TEST_TOKEN;

    const testApp= setupTestApp()
    describe("Intgretation test for books CRUD API", () => {
        test("should get newly created book via GET route", async()=>{
        const testBook= {
                "title": "Test book 2",
                "author": "Test author 2",
                "isbn": "1234567892",
                "published_year": 2024
            }

        const postResponse = await testApp.inject({
            method: "POST",
            url: "/v1/books/",
            headers: {"authorization": testToken},
            payload: testBook
        })
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.json()).toMatchObject(testBook);

        const getResponse= await testApp.inject({
            method: "GET",
            url: "/v1/books/" + postResponse.json().id,
            headers: {"authorization": testToken},
        })

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.json()).toMatchObject(testBook);
        })

        test("should get created books via GET route", async()=>{
            const testBook= {
                    "title": "Test book 2",
                    "author": "Test author 2",
                    "isbn": "1234567892",
                    "published_year": 2024
                }

            const postResponse = await testApp.inject({
                method: "POST",
                url: "/v1/books/",
                headers: {"authorization": testToken},
                payload: testBook
            })
            expect(postResponse.statusCode).toBe(201);
            expect(postResponse.json()).toMatchObject(testBook);

            const getResponse= await testApp.inject({
                method: "GET",
                url: "/v1/books/",
                headers: {"authorization": testToken},
            })
            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.json().length).toBe(2)
        })
    })
    ```
Fastify comes with built-in support for fake HTTP injection thanks to light-my-request(another npm module). Which basically give you a minimally running application without the need to do app.listen like for example in Express, which we use to inject and call our predefined routes.

So .inject ensures all registered plugins have booted up and our application is ready to test. Finally, we pass the request method we want to use and a route. Using await we can store the response without a callback.

 ### 15. Celebrate achivement 🥳
And there you have it a fully operational CRUD web-application with fastify communicating with a postgres database 🥳🙌🎉
