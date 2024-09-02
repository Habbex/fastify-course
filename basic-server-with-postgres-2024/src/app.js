const fastify = require('fastify')
const fastifyPostgres= require('@fastify/postgres')
const { dbCheck } = require('./routes/v1/dbCheck')
const booksRoute = require('./routes/v1/books')

 
const build = (options = {}, optsPostgres={})=>{
    const app = fastify(options)
    app.register(fastifyPostgres, optsPostgres)
    app.register(dbCheck)
    app.register(booksRoute)
    return app
}

module.exports={build}