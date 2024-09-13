const build_auth_app = require('./app')
const env = require("../config/env")

const auth_app = build_auth_app(
    { logger: true },
    { connectionString: env.POSTGRES_DB_CONNECTION_STRING },
    { secret: env.JWT_SECRET },
    {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Auth swagger',
                description: 'Swagger for AUTH endpoints',
                version: '0.1.0'
            },
            servers: [
                {
                    url: `${env.AUTH_APP_HOST}:${env.AUTH_APP_HOST_PORT}`,
                    description: 'Development server'
                }
            ]
        }
    },
    {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        }
    }
)

module.exports= auth_app;

