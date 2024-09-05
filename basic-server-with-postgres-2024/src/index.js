const app = require("./library/server")
const auth_app = require("./auth/server")
const env = require("./config/env")

app.listen({ port: env.WEB_APP_HOST_PORT, host: 'localhost' }, (err) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})

auth_app.listen({ port: env.AUTH_APP_HOST_PORT, host: 'localhost' }, (err) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})

