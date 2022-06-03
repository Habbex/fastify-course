const fastify = require('fastify');
const fastifySwagger= require('fastify-swagger');
const fastifyPostgres= require('@fastify/postgres');
const {itemRoutes_v1} = require('./routes/v1/items');
const {itemRoutes_v2}= require('./routes/v2/items');

const build =(opts={}, optsSwagger={}, optsPostgres={})=>{
    const app= fastify(opts);
    app.register(fastifyPostgres, optsPostgres);
    app.register(fastifySwagger, optsSwagger);
    app.register(itemRoutes_v1, {prefix: '/v1'});
    app.register(itemRoutes_v2, {prefix: '/v2'});
    return app;
};

module.exports={build};