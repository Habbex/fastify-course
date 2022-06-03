const { build } = require("./app");


const app = build(
  {
    logger: true
  },
  {
    exposeRoute: true,
    routePrefix: "/docs",
    swagger:
    {
      info: { title: "Fastify API", version: "1.0.0" }
    }
  },{
    connectionString: 'postgres://postgres:postgres@localhost:5432/postgres'
  });


  app.get('/time', (req, reply) => {

    app.pg.connect(onConnect)
  
    function onConnect (err, client, release) {
      if (err) return reply.send(err)
  
      client.query(
        'SELECT now()',
        function onResult (err, result) {
          release()
          reply.send(err || result.rows[0])
        }
      )
    }
  })

// Run the server!
app.listen(3000, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
