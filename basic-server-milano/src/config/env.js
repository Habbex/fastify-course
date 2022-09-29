require('dotenv').config

const envaild = require('envalid')

module.exports = envaild.cleanEnv(process.env, {
    POSTGRES_DB_CONNECTION_STRING : envaild.str({}),
    POSTGRES_TEMP_DB_CONNECTION_STRING : envaild.str({}),
    WEB_APP_HOST_PORT : envaild.num({default: 8080})
})