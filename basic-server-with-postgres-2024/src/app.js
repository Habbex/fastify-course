const fastify = require('fastify')
const fastifyPostgres= require('@fastify/postgres')
const fastifySwagger= require('@fastify/swagger')
const fastifySwaggerUI= require('@fastify/swagger-ui')
const { dbCheck } = require('./routes/v1/dbCheck')
const booksRoute = require('./routes/v1/books')

 
const build = (options = {}, optsSwagger={}, optsSwaggerUI={}, optsPostgres={})=>{
    const app = fastify(options)
    app.register(fastifySwagger, optsSwagger)
    app.register(fastifySwaggerUI, optsSwaggerUI)
    app.register(fastifyPostgres, optsPostgres)
    app.register(dbCheck, {prefix: '/healthcheck'})
    app.register(booksRoute, {prefix: '/v1/books'})
    return app
}

module.exports={build}