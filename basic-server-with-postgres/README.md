
# Fastify course with postgres

This readme will explain how to update our current basic we-application to communicate with a Database, in this case postgres DB.


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
 const itemRoutes_v2 = async (fastify, options, done) => {

  fastify.post("/", postItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { name, description } = request.body;
      const { rows } = await fastify.pg.query(
        "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
      );
      reply.code(201).send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });

  done();
};

module.exports = { itemRoutes_v2 };
```

As you we can see the plugin for fastify-postgres `fastify.pg.query()` take the query string , query parameters and callback function `onResult` which can be either an error or the result of the query. 

We are adding in the end of the query `RETURNING *` in order to return the result of the query which will reply with. 

We'll be using async / await for our promise control flow, and if our handler is an async function or returns a promise.

We should be aware of a special behavior that is necessary to support the callback and promise control-flow.
 
If the handler's promise is resolved with undefined, it will be ignored causing the request to hang and an error log to be emitted.

If you want to use async/await or promises but return a value with `reply.send`:
 - Do not `return` any value.
 - Do not forget to call `reply.send`.

If you want to use async/await or promises:
 - Do not use `reply.send`.
 - Do not return `undefined` (Return something else!)

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

Notice that we now have two endpoints with the same route i.e POST /, in order to differentiate between then we can add a prefix as an option to our routes :
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

Add a couple of items to the table so we can later on get some results after have create GET all item endpoint and GET item by id endpoint. 

## Create GET all and GET by id endpoints.

Let's create two new endpoints to GET all and GET by id :

**GET ALL items** 
```
  fastify.get("/", async (req, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM items");
      // Note: avoid doing expensive computation here, this will block releasing the client
      reply.send(rows);
    } catch (err) {
      reply.send(err);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release();
    }
  });
```

**GET item by id**
```
  fastify.get("/:id", getItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      const { rows } = await fastify.pg.query(
        "SELECT * FROM items WHERE id=$1",
        [id]
      );
      reply.send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });
```

We update our `test.http` file with two example request to test it out :
```
### GET ALL ITEMS
GET http://127.0.0.1:3000/v2/ HTTP/1.1

### GET SINGLE ITEMS
GET http://127.0.0.1:3000/v2/1 HTTP/1.1 
```

## Create PUT and DELETE endpoints 

Let's create two new endpoints to update an existing item and also the ability to delete an item:

**Update an item by id**
```
  fastify.put("/:id", updateItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      const { name, description } = request.body;
      const { rows } = await fastify.pg.query(
        "UPDATE items SET name=$1, description=$2 WHERE id=$3 RETURNING *",
        [name, description, id]
      );
      reply.send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });
```

**DELETE an item by id**
```
  fastify.delete("/:id", deleteItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      await fastify.pg.query("DELETE FROM items WHERE id=$1", [id]);
      reply.send(`Item ${id} deleted`);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });
```
We update our `test.http` file with two example request to test it out :
```
### UPDATE ITEM
PUT http://localhost:3000/v2/2 HTTP/1.1
Content-Type: application/json

{
  "name": "Updated Item",
  "description": "Updated Item Description"
}

### DELETE SINGLE ITEMS
DELETE  http://127.0.0.1:3000/v2/1 HTTP/1.1 
```

### SQL injections
Worth mentioning that you could avoid using string interpolation (with backtick's ``) when creating our queries , as the example below :
`SELECT * items WHERE id=${id}`

```
  fastify.put("/test/:id", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const {id } = request.body;
      const { rows } = await fastify.pg.query(
        `SELECT * items WHERE id=${id}`
      );
      reply.send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });
```

Since this would allow hackers to inject SQL queries that would cause major damage to your system such as this example :
```
### UPDATE ITEM
PUT http://localhost:3000/v2/test/4 HTTP/1.1
Content-Type: application/json

{
  "id" : "x\\';DROP TABLE temptable; --"
}
```

We should always pass in values as parameters to the query, such as we have done in this session :
```
 const { rows } = await fastify.pg.query(
        "UPDATE items SET name=$1, description=$2 WHERE id=$3 RETURNING *",
        [name, description, id]
      );
```
## Unit test with JEST
1. First we download and install the testing framework *JEST* with `npm i jest --save`.

2. Update the `package.json` file and add to new npm script commands:
- `"test": "jest --coverage --runInBand",` Which can be called with `npm run test`
- `"test:watch": "jest --watch",` Which can be call with `npm run test:watch`, and will run JEST in watch mode and always rerunning the tests while you are creating them. 

3. Let's work in TDD mode where we first develop the test then the actual implementation, so we create a new folder called `__test__` and inside it we create a new file called `vatCalculator.test.js`:
```
const vatCalculator = require('../src/utlis/vatCalculator');

describe("VAT calculator", ()=>{

    test("Should return the correct VAT excluded amount for 20% VAT", () => {
        // arrange and act
        const result = vatCalculator.calculateVAT(16.67)
        // assert
        expect(result).toBe(3.33);
    });

    test("Should return the correct gross amount for 20% VAT", () => {
        // arrange and act
        const result = vatCalculator.calculateGrossAmount(16.67)
        // assert
        expect(result).toBe(20.00);
    });

    test("Should return the correct net amount for 20% VAT", () => {
        // arrange and act
        const result = vatCalculator.calculateNetAmount(20.00)
        // assert
        expect(result).toBe(16.67);
    });
})
```

4. Well be creating a utlis functionality which will calculate the VAT of an *gross Amount* , so we can store in database the *net Amount* and *excluded VAT amount* of a VAT 20%. We create a new folder called `utlis` and inside it a file called `vatCalculator.js`
```
const vatCalculator = {
    calculateVAT: (netAmount) => {
        return Math.round((netAmount * 0.20) * 1e2) / 1e2;
    },
    calculateGrossAmount: (netAmount) => {
        return Math.round((netAmount * 1.20)* 1e2) / 1e2;
    },
    calculateNetAmount: (grossAmount) => {
        return Math.round((grossAmount / 1.20)* 1e2) / 1e2;
    }
}

module.exports = vatCalculator;
```

5. Let's alter the table in order to add 3 new columns (gross_amount, net_amount, excluded_vat_amount):
```
ALTER TABLE items
ADD gross_amount NUMERIC,
ADD net_amount NUMERIC,
ADD excluded_vat_amount NUMERIC 
``` 

6. Since we have updated the table we also need to update the schema in our `routes/v2/items.js.

### Item schema
```
const Item = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    gross_amount: { type: "number" }
  }
};
```

### Post Item schema
```
const postItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "description", "gross_amount"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        gross_amount: { type: "number" },
      },
    },
    response: {
      201: Item,
    },
  },
};
```

### Update Item schema
```
const updateItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "description", "gross_amount"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        gross_amount: { type: "number" },
      },
    },
    response: {
      200: Item,
    },
  },
};
```

7. We update our POST and PUT routes to use the *VATCalculator*  after have imported it `const vatCalculator = require("../../utlis/vatCalculator");`

### POST route
```
  fastify.post("/", postItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { name, description, gross_amount } = request.body;
      const netAmount=  vatCalculator.calculateNetAmount(gross_amount);
      const vatAmount = vatCalculator.calculateVAT(netAmount);
      const { rows } = await fastify.pg.query(
        "INSERT INTO items (name, description, gross_amount , net_amount , excluded_vat_amount) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, description, gross_amount, netAmount, vatAmount]
      );
      reply.code(201).send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });
```

### PUT route
```
  fastify.put("/:id", updateItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      const { name, description, gross_amount } = request.body;
      const netAmount=  vatCalculator.calculateNetAmount(gross_amount);
      const vatAmount = vatCalculator.calculateVAT(netAmount);
      const { rows } = await fastify.pg.query(
        "UPDATE items SET name=$1, description=$2, gross_amount=$3, net_amount=$4, excluded_vat_amount=$5 WHERE id=$6 RETURNING *",
        [name, description, gross_amount, netAmount, vatAmount, id]
      );
      reply.send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });
```


## Integration test with JEST
1. Then we create a new folder next to `src` folder , and we call it `__int_tests__` which is `__int + __test__` based on how *Jest* looks for test files. 

2. Inside the folder we create a new javaScript file called `setupTestEnv.js`, which we'll setup a test setup of our environment:
```
const { build } = require("../src/app");
const env = require("../src/config/env");

const clearDatabaseSQL = "DELETE FROM items";
const createTableSQL =
  "CREATE TABLE IF NOT EXISTS Items (id SERIAL, name VARCHAR(200),description VARCHAR(500), gross_amount NUMERIC , net_amount NUMERIC , excluded_vat_amount NUMERIC, PRIMARY KEY(id));";
const insertFakeItemSQL =
  "INSERT INTO items (name, description, gross_amount , net_amount , excluded_vat_amount) VALUES ($1, $2, $3, $4, $5)";

module.exports = function setupTestEnv() {
  const app = build(
    {
      logger: true,
    },
    {},
    {
      connectionString: env.POSTGRES_TEMP_DB_CONNECTION_STRING,
    }
  );

  beforeAll(async () => {
    await app.ready();
    await app.pg.query(createTableSQL);
    await app.pg.query(clearDatabaseSQL);
  });

  beforeEach(async () => {
    await app.pg.query(insertFakeItemSQL, ["Test Item", "This is a test item", 20, 16.67, 3.33]);
  });

  afterEach(async () => {
    await app.pg.query(clearDatabaseSQL);
  });

  afterAll(async () => {
    await app.close();
  });

  return app;
};
``` 
Remember in the beginning when we decided to modularize our application , it's to easily use the same build function when running our integration test. 

3. We'll update our `config/env.js` file and give it a new environment variable of a postgres DB connection string pointing to a temp database which we'll create by running : 
`Create DATABASE postgres_temp`.

4. The temp database will serve as our test database which we will test all our CRUD endpoints towards. 

5. Often while writing tests you have some setup work that needs to happen before tests run, and you have some finishing work that needs to happen after tests run like `beforeEach` or `afterEach` hooks. 

Some test we only need to do the setup once like for `beforeAll` or `AfterAll` hooks. 

- For us we'll create a test table `beforeAll` test, and we clear the table just to be sure. 
- `beforeEach` test we'll insert a fake entry of an item which we can use in our integration tests. 

- `afterEach` test we'll create the test table.

- `afterAll` After all the test's are done , we teardown the setup by calling `await app.close();`

6. Now we'll move on to create our integration test by creating a new javaScript and call it `items.test.js`:
```
const setupTestEnv = require("./setupTestEnv");

const app = setupTestEnv();

describe("Intgretation test for CRUD endpoints connected to test db", () => {

    test('should create an item via POST route', async () => {
        const item = {
            name: "Test Item",
            description: "This is a test item",
            gross_amount: 20,   
        };
        
        const response = await app.inject({
            method: "POST",
            url: "/v2/",
            payload: item,
        });
        
        expect(response.statusCode).toBe(201);
        expect(response.json()).toMatchObject(item);
    });
    
    test('should retrieve created items via GET route', async () => {
        const item = {
            name: "Test Item",
            description: "This is a test item",
        };
        const response = await app.inject({
            method: "GET",
            url: "/v2/",
        });
    
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject([item]);
    });
    
    test('should update an item', async () => {
        const {rows} = await app.pg.query("SELECT * FROM items LIMIT 1");
        expect(rows.length).toBe(1)
        const item = rows[0];
    
        const updatedItem = {
            name: "Updated Item",
            description: "This is an updated item",
            gross_amount: 20,   
        };
    
        const updatedResponse = await app.inject({
            method: "PUT",
            url: "/v2/" + item.id,
            payload: updatedItem,
        });
    
        expect(updatedResponse.statusCode).toBe(200);
        expect(updatedResponse.json()).toMatchObject(updatedItem);
    });
    
    test('should delete an item', async () => {
        const {rows} = await app.pg.query("SELECT * FROM items LIMIT 1");
        expect(rows.length).toBe(1)
        const item = rows[0];
    
        const deleteResponse = await app.inject({
            method: "DELETE",
            url: "/v2/" + item.id,
        });
    
        expect(deleteResponse.statusCode).toBe(200);
    });
});
``` 

Fastify comes with built-in support for fake HTTP injection thanks to light-my-request(another npm module). Which basically give you a minimally running application without the need to do `app.listen` like for example in *Express*, which we use to inject and call our predefined routes. 

So `.inject` ensures all registered plugins have booted up and our application is ready to test. Finally, we pass the request method we want to use and a route. Using await we can store the response without a callback.


## Setup Postgres and Adminer with Docker compose.
1. We go to DockerHub.com and search for both postgres and adminer , in order to get and understand of the variables they need. 

2. We construct our `docker-compose.yml` file as below :
```
version: '3.8'

services:
  postgres:
    container_name: postgres
    image: postgres:14
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: [ 'CMD-SHELL', 'pg_isready -U postgres' ]
      interval: 10s
      timeout: 5s
      retries: 60

  adminer:
    container_name: adminer
    image: adminer:4.8.1
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - '${ADMINER_HOST_PORT:-8081}:8080'
volumes:
  pgdata:
```

3. We add presistant name volume : 
```
    volumes:
      - pgdata:/var/lib/postgresql/data
----
volumes:
  pgdata:
``` 
So the data in the database is stored and not clear out on container shutdown.

4. It's important to determine and fail fast then running our container , it's why it's important to add healthcheck to our containers which check if it's health and up and running and stops the workflow for others depneding on it such as *Adminer* : 
```
    healthcheck:
      test: [ 'CMD-SHELL', 'pg_isready -U postgres' ]
      interval: 10s
      timeout: 5s
      retries: 60
```

```
    depends_on:
      postgres:
        condition: service_healthy
```

5. We can use the same environment varablies which we created before to pass in as variables for the container to use, we can also condition the variables by if they are empty/ not set we'll use an default value : 
```
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
```

Inside the .env (*Remember to never push this to the repo, since it could contain sensative information such as passwords*):
```
POSTGRES_DB_CONNECTION_STRING = "postgres://postgres:postgres@postgres:5432/postgres"
POSTGRES_TEMP_DB_CONNECTION_STRING = "postgres://postgres:postgres@postgres:5432/postgres_temp"

WEB_APP_HOST_PORT= "8080"
ADMINER_HOST_PORT= "8081"

POSTGRES_PASSWORD= "postgres"
```



6. Run your multi-contianer setup , by running the command : `docker-compose up`.



## Setup your web-app in Docker-compose

1. We'll split up our setup of our web-app into two services , one will install and setup the web-app and another will run the web-app:

```
services:
  setup-web-app:
    image: node:14.16.0
    working_dir: /usr/src/web-app
    entrypoint: [ 'npm', 'i' ]
    volumes:
      - ./docker-data/node_modules:/usr/src/web-app/node_modules
      - ./package.json:/usr/src/web-app/package.json
      - ./package-lock.json:/usr/src/web-app/package-lock.json

  web-app:
    container_name: web-app
    image: node:14.16.0
    working_dir: /usr/src/web-app
    entrypoint: [ 'npm', 'run', 'start' ]
    ports:
      - '${WEB_APP_HOST_PORT:-8080}:8080'
    volumes:
      - ./docker-data/node_modules:/usr/src/web-app/node_modules
      - ./package.json:/usr/src/web-app/package.json
      - ./package-lock.json:/usr/src/web-app/package-lock.json
      - .:/usr/src/web-app
    env_file:
      - .env
    environment:
      POSTGRES_DB_CONNECTION_STRING: '${POSTGRES_DB_CONNECTION_STRING}'
      POSTGRES_TEMP_DB_CONNECTION_STRING: '${POSTGRES_TEMP_DB_CONNECTION_STRING}'
    depends_on:
      postgres:
        condition: service_healthy
```

2. We'll add a health check to our web-app , in order to ensure it's up and running and healthly. We create a new route file and call it `healthcheck.js` in our `routes` folder:
```
const healthcheck = (fastify, options, done) => {
    fastify.get('/', (req, reply) => {
        reply.send("I'm okay")   
    })
    done()
}

module.exports = {healthcheck}
```

Update the `app.js` file to register our route :
```
const fastify = require('fastify');
const fastifySwagger= require('fastify-swagger');
const fastifyPostgres= require('@fastify/postgres');
const {itemRoutes_v1} = require('./routes/v1/items');
const {itemRoutes_v2}= require('./routes/v2/items');
const {healthcheck} = require('./routes/healthcheck');

const build =(opts={}, optsSwagger={}, optsPostgres={})=>{
    const app= fastify(opts);
    app.register(fastifyPostgres, optsPostgres);
    app.register(fastifySwagger, optsSwagger);
    app.register(itemRoutes_v1, {prefix: '/v1'});
    app.register(itemRoutes_v2, {prefix: '/v2'});
    app.register(healthcheck, {prefix: '/healthcheck'});
    return app;
};

module.exports={build};
```

3. We add the healthcheck section for our web-app in `docker-compse.yml`file:
```
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '-qO',
          '-',
          'http://localhost:8080/healthcheck'
        ]
      interval: 10s
      timeout: 5s
      retries: 20
```


4. Update the `env.js` file to be able to use the port specified in the `.env` file : 
```
require('dotenv').config();
const envalid = require('envalid');

module.exports= envalid.cleanEnv(process.env, {
    POSTGRES_DB_CONNECTION_STRING: envalid.str({}),
    POSTGRES_TEMP_DB_CONNECTION_STRING: envalid.str({}),
    WEB_APP_HOST_PORT: envalid.num({ default: 8080 }),
})
```

And update the `server.js` file :
```
app.listen(env.WEB_APP_HOST_PORT , '0.0.0.0', async (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
```

5. We run our application by running : `docker-compose up -d`.

6. We run `docker-compose ps` to see if our services are health and running. 

## Celebrate your achievement 🥳 
And there you have it a fully operational CRUD web-application with fastify communicating with a postgres database 🥳🙌🎉 