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
                    url: 'http://localhost:3000',
                    description: 'Development server'
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header',
                        description: 'Enter the token with the `Bearer ` prefix before the actual token'
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

