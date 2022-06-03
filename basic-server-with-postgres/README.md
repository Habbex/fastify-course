
# Fastify course with postgres

This readme will explain how to update our current basic we-application to communicate with a Database, in this case postgres DB.

## Setup Postgres and Adminer with Docker compose.


## Install pg and fastify-postgres plugin
1. `npm i pg @fastify/postgres --save`
2. inspect the `package.json` file 
3. register the plugin in the `app.js` file:
```
const fastifyPostgres= require('@fastify/postgres');
...
const build =(opts={}, optsSwagger={}, optsPostgres={})=>{
    const app= fastify(opts);
    app.register(fastifyPostgres, optsPostgres);
    app.register(fastifySwagger, optsSwagger);
    app.register(itemRoutes);
    return app;
};

```
4. Supply the postgres connectionstring in the `server.js`:
```
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
```

5. Create a simple route to call the database to get the current time : 
```
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

```

6. Create a test request to call and test out the route : 
`GET http://127.0.0.1:3000/time HTTP/1.1`


## Create a simple table
We'll create a simple database table which we'll use to work with in this example.

1. Either use Adminer or psql CLI to create the following database table :
```
CREATE TABLE Items (id SERIAL, name VARCHAR(200),description VARCHAR(500), PRIMARY KEY(id));
```


## Create POST endpoint to Insert new Item.
Let's test it out by creating a new routes files which we'll call v2 :
`routes -> v2 -> items.js`

We create a function as the have in the `v1/items.js` file :
```
const itemRoutes_v2 = (fastify, options, done) => {

  fastify.post("/", postItemOpts, (request, reply) => {
    const { name, description } = request.body;
    fastify.pg.query('INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *', [name, description],
     (err, result) => {
        if (err){
            return reply.code(500).send(err);
        } 
        reply.code(201).send({ id: result.rows[0].id, name, description });
    })
  });

  done();
};

module.exports = { itemRoutes_v2 };
```

As you we can see the plugin for fastify-postgres `fastify.pg.query()` take the query string , query parameters and callback function `onResult` which can be either an error or the result of the query. 

We are adding in the end of the query `RETURNING *` in order to return the result of the query which will reply with. 

We'll be using the same schema as in `v1/items.js` file for adding new items : 
```
const postItemOpts = {
  schema: {
    body:{
      type: "object",
      required: ["name", "description"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      }
    },
    response: {
      201: Item,
    },
  },
};
```

Let's register our version 2 route in our `app.js` file, by first importing it then register it in the *build* function :
```
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
```

Notice that we now have two endpoints with the same route i.e POST /, in order to diffireniceate between then we can add a prefix as an option to our routes :
```
    app.register(itemRoutes_v1, {prefix: '/v1'});
    app.register(itemRoutes_v2, {prefix: '/v2'});
```

Let's test the route by copying the previous one and adding `v2` in the end :

```
POST http://localhost:3000/v2 HTTP/1.1
Content-Type: application/json

{
  "name": "New Item",
  "description": "New Item Description"
}
```


## Celebrate your achievement 🥳 
And there you have it a fully operational CRUD web-application with fastify 🥳🙌🎉 