require('dotenv').config();
const envalid = require('envalid');

module.exports= envalid.cleanEnv(process.env, {
    POSTGRES_DB_CONNECTION_STRING: envalid.str({}),
    POSTGRES_TEMP_DB_CONNECTION_STRING: envalid.str({}),
    WEB_APP_HOST_PORT: envalid.num({ default: 8080 }),
})