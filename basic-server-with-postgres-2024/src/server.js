const { build } = require('./app')

const app = build(
    { logger: true },
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
            ]
        }
    },
    {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
    },
    { connectionString: 'postgres://postgres:postgres@localhost:5432/library' },
)

app.listen({ port: 3000 }, (err) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})