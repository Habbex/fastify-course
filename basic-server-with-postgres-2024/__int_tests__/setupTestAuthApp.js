const build_auth_app = require("../src/auth/app")
const env = require("../src/config/env");

const createTableSQL = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);`
const clearTableSQL = "TRUNCATE TABLE users"

module.exports = function setupTestAuthApp() {
    const auth_app= build_auth_app(
        {
            logger: true,
        },
        {
            connectionString: env.POSTGRES_TEST_DB_CONNECTION_STRING, // connect to test database
        },
        {
            secret: env.JWT_SECRET,
        }
    )

    beforeAll(async () => {
        await auth_app.ready();
        await auth_app.pg.query(createTableSQL)
    });

    afterEach(async () => {
        await auth_app.pg.query(clearTableSQL);
    });

    afterAll(async () => {
        await auth_app.pg.query(clearTableSQL);
        auth_app.close();
    });

    return auth_app;
};