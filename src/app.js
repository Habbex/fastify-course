const fastify = require('fastify');
const {itemRoutes} = require('./routes/v1/items');

const build =(opts={})=>{
    const app= fastify(opts);
    app.register(itemRoutes);
    return app;
};

module.exports={build};