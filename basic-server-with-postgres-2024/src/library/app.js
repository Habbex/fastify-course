const fastify = require('fastify')
const fastifyPostgres= require('@fastify/postgres')
const fastifySwagger= require('@fastify/swagger')
const fastifySwaggerUI= require('@fastify/swagger-ui')
const fastifyJwt= require('@fastify/jwt')
const fastifyBcrypt= require('fastify-bcrypt')
const { dbCheck } = require('./routes/v1/dbCheck')
const booksRoute = require('./routes/v1/books')

 
const build_web_app = (options = {},optsPostgres={}, optsJWT={}, optsSwagger={}, optsSwaggerUI={})=>{
    const app = fastify(options)
    
    app.register(fastifyPostgres, optsPostgres)

    app.register(fastifyJwt, optsJWT)
    app.register(fastifyBcrypt)

    app.register(fastifySwagger, optsSwagger)
    app.register(fastifySwaggerUI, optsSwaggerUI)
  
    app.register(dbCheck, {prefix: '/healthcheck'})
    app.register(booksRoute, {prefix: '/v1/books'})

    return app
}

module.exports=build_web_app