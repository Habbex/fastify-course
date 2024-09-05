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