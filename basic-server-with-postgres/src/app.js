// Setup 
const fastify = require('fastify')
const fastifySwagger= require('@fastify/swagger')
const fastifyPostgres= require('@fastify/postgres')
const {itemRoutes}= require('./routes/v1/items')
const {itemRoutes_v2}= require('./routes/v2/items')
const {healthcheck} = require('./routes/healthcheck')

const build =(options={}, optionSwagger={}, optionPostgres={})=>{
    const app = fastify(options)

    app.register(fastifyPostgres, optionPostgres)

    app.register(fastifySwagger, optionSwagger)
    
    app.register(itemRoutes, {prefix:'/v1'})

    app.register(itemRoutes_v2, {prefix: '/v2'})

    app.register(healthcheck, {prefix:'/healthcheck'})

    return app
}

module.exports={build}