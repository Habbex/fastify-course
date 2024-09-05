const fastify = require('fastify')
const fastifyPostgres= require('@fastify/postgres')
const fastifySwagger= require('@fastify/swagger')
const fastifySwaggerUI= require('@fastify/swagger-ui')
const fastifyJwt= require('@fastify/jwt')
const fastifyBcrypt= require('fastify-bcrypt')
const authRoutes= require("./routes/auth")


const build_auth_app = (options = {},optsPostgres={}, optsJWT={}, optsSwagger={}, optsSwaggerUI={})=>{
    const app = fastify(options)
    
    app.register(fastifyPostgres, optsPostgres)

    app.register(fastifyJwt, optsJWT)
    app.register(fastifyBcrypt)

    app.register(fastifySwagger, optsSwagger)
    app.register(fastifySwaggerUI, optsSwaggerUI)
  
    app.register(authRoutes, {prefix: '/auth/'})

    return app
}

module.exports=build_auth_app