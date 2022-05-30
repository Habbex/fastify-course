const fastify = require('fastify')({logger: true});

// Delcare a route
fastify.get('/', (request, reply) => {
  return { hello: 'world' };
});

// Run the server!
fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});