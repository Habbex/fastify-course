const { build } = require("./app");
const env = require("./config/env");

const app = build(
  {
    logger: true,
  },
  {
    exposeRoute: true,
    routePrefix: "/docs",
    swagger: {
      info: { title: "Fastify API", version: "1.0.0" },
    },
  },
  {
    connectionString: env.POSTGRES_DB_CONNECTION_STRING,
  }
);

// Run the server!
app.listen(env.WEB_APP_HOST_PORT , '0.0.0.0', async (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
