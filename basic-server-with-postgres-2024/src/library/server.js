const build_web_app = require('./app')
const env = require("../config/env")

const app = build_web_app(
    { logger: true },
    { connectionString: env.POSTGRES_DB_CONNECTION_STRING },
    { secret: env.JWT_SECRET },
    {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Test swagger',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0'
            },
            servers: [
                {
                    url: env.WEB_APP_HOST,
                    description: 'Development server'
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: "bearer",
                        bearerFormat: "JWT" , 
                        description: 'Enter the JWT token from sign-in API'
                    }
                }
            },
        }
    },
    {
        routePrefix: '/docs',
        security: [{ bearerAuth: [] }],
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
    }
)

module.exports = app

