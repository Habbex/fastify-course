require('dotenv').config()

const envaild = require('envalid')

module.exports = envaild.cleanEnv(process.env, {
    POSTGRES_DB_CONNECTION_STRING : envaild.str({}),
    POSTGRES_TEST_DB_CONNECTION_STRING : envaild.str({}),
    JWT_SECRET: envaild.str({}),
    TEST_TOKEN: envaild.str({}),
    WEB_APP_HOST_PORT: envaild.num({default:8080}),
    WEB_APP_HOST: envaild.str({default: "http://127.0.0.1"}),
    AUTH_APP_HOST_PORT: envaild.num({default:8081}),
    AUTH_APP_HOST: envaild.str({default: "http://127.0.0.1"})
})