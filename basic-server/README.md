
# Fastify course

  

This readme will explain how to create a simple web-application using node.js and Fastify.js framework.

  

## Create git repository

Well create a new git repository to source version control our code.

  

## Setup the project.

Once the Github repo is setup we clone the repo to our development machine and run `npm init` and hit accept on every step.

  

We install nodemon as a *dev dependency* : `npm i nodemon --save-dev`, for rapid development.

  

We install fastify : `npm i fastify --save`

  

## Create our first server

  

1. We create a src folder with will contain all our code.

2. inside the src folder we create a javascript file with the name server.js

3. Inside the server.js file we include the fastify module which we have installed before , and enabling the logger by setting it to true:

```

const fastify = require('fastify')({

logger: true

})

```

4. We declare a our first route , which will be a GET endpoint returning hello world as its response:

```

fastify.get('/', function (request, reply) {

reply.send({ hello: 'world' })

})

```

5. Finally we run the server by calling fastify.listen and passing a port number and a callback function:

```

fastify.listen(3000, function (err, address) {

if (err){

fastify.log.error(err)

process.exit(1)

}

// Server is now listening on ${address}

})

```

6. Now we go to the package.json to add a npm script in order to run the server.js file with nodemon , but updating the package.json file :

```

"dev": "nodemon src/server.js",

  

"start": "node src/server.js"

```

  

7. Run the server by calling : `npm run dev`

8. You will see that the server is up and running listening on localhost with port 3000.

9. Download and install the VS code extension REST client, to quickly create a test file which you can send requests from without having to use and external application like *postman*.

10. Create a new folder and call it test , and inside of the test folder create a file called *test.http*

11. Inside the *test.http* adding the following request and hit send request:

```

### GET

GET http://127.0.0.1:3000 HTTP/1.1

```

12. You could get a 200 response code with the content of :

`{"hello" : "world"}`

  

## Modularization of our web-application 1

  

In order to have a better structure for our web-application we'll create a new JavaScript file called `app.js`.

  

The `app.js` file is where we will add all our routes and plugins, in order to have them later on being initialized in a common build function inside `app.js` which we import to the `server.js` file and listen to.

  

1. We'll move the import for fastify to the `app.js` file

2. We'll create a our common build function which takes in options as `opts`, and inside the function we call the fastify module:

```

const fastify = require('fastify');

const build =(opts={})=>{

const app= fastify(opts);

return app;

};

module.exports={build};

```

3. Then inside the `server.js` file we'll import the `app.js` and it's common build function, and call and pass in the the fastify option `{ logger: true }` . Then we update the rest of the file to use const app instead of fastify:

```

const { build } = require("./app");

const app = build({ logger: true });

  

// Delcare a route

app.get("/", (request, reply) => {

return { hello: "world" };

});

// Run the server!

app.listen(3000, (err, address) => {

if (err) {

app.log.error(err);

process.exit(1);

}

app.log.info(`server listening on ${address}`);

});

```

  

As you can see, the app Is the returning object of the **build** function, so if I need it in another place (unit testing for example), I can simply import the build function.

  
  
  

## Modularization of our web-application 2

Now we focus our attention on the route in our `server.js`, and update our application so that it will reside in its own file, which we will later on include/register in our common build function inside `app.js` file.

  

1. Create a new folder inside *src* and call it *routes*, and inside the *routes* folder create and other folder and call it *v1* and inside of it create a new javascript file called `items.js`.

2. Inside the `items.js` we create a function which we call *itemRoutes*, which takes in fastify, options and a callback of done with we add in the end of the function:

```

const itemRoutes=(fastify,options, done)=>{

fastify.get('/' , (request, reply)=>{

return { hello: "world" };

})

done();

}

module.exports={itemRoutes};

```

  

3. Then we register our new routes file as a plugin for fastify inside `app.js`, by first importing it : `const {itemRoutes} = require('./routes/v1/items');` then adding the line : `app.register(itemRoutes);`

4. Calling the web-application again via REST client will yield the same results.

  

## Create a items.js file and Get Single Item

For simplicity sake we'll be working in memory with a `Items.js` file containing an array of items :

```

let items = [

{id: '1', name: 'Item 1', description: 'Item 1 description'},

{id: '2', name: 'Item 2', description: 'Item 2 description'},

{id: '3', name: 'Item 3', description: 'Item 3 description'},

]

module.exports= items;

```

Which we will create in the *src* folder.

  

1. Let's add GET by *id* in order to test it out. Well get the *id* by accessing the *request bodys params* , and we'll use destructing to get the id being passed in the request body : `const { id } = request.params;`

2. We'll use a simple find function to filter out based on *id* to return the requested *item*:

```

fastify.get("/:id", (request, reply) => {

const { id } = request.params;

const item = items.find((item) => item.id === id);

reply.send(item);

});

```

3. We update our `test.http` file to add an endpoint call to get a single item : `GET http://127.0.0.1:3000/1 HTTP/1.1`

  

## Validation and schema

Now on of the strong suit of fastify is its handling of validation and schemas , which basically allows us to format the responses which we get from each of the calls and also allows us to validate the request body to ensure we are receiving the correct information.

  

This is done by creating an object containing information on how the response needs to look like and what validations it requires.

  

We later on pass this object into the fastify route declaration.

  

So let's create our first options schema for GET all items:

```

// Options for get all items

  

const getItemsOpts = {

schema: {

response: {

200: {

type: 'array',

items: {

type: "object",

properties: {

id: { type: "string" },

name: { type: "string" },

description: { type: "string" },

},

},

},

},

},

}

```

We can format for each response we get, so 200 response we want it to be the type of array and inside of the array it's and object and each object is made up of id(string) , name (string) and description(string).

  

And then we pass in the *getItemsOpts* to the routes as a second argument: `fastify.get("/", getItemsOpts,(request, reply) =>`

  

We can comment out the *id* in the schema , and you will se that it's no longer in the response, we can also change the type of the *id* to an integer and fastify will coerce it to become and integer instead of string in the response.

  

Let's create a schema for GET single item :

```

const getItemOpts = {

schema: {

response: {

200: {

type: "object",

properties: {

id: { type: "string" },

name: { type: "string" },

description: { type: "string" },

},

},

},

},

};

```

  

As you can see we have the same *item* schema in both of the options, and since we will be using it again let's create an item schema which we add for both of the options and other future ones:

  

```

const Item = {

type: "object",

properties: {

id: { type: "string" },

name: { type: "string" },

description: { type: "string" },

},

};

  

const getItemsOpts = {

schema: {

response: {

200: {

type: "array",

items:  Item ,

},

},

},

};

  

const getItemOpts = {

schema: {

response: {

200: Item,

},

},

};

```

## Add Fastify swagger plugin 
Before we add the rest of the routes to our web-application , let's add fastify swagger plugin in order to have a better documentation of our endpoints.

 1. Stop the running application by hitting `ctrl +c`
 2. Run `npm i fastify-swagger --save`
 3. Inspect the `package.json` file , to see it installed and added.
 4. Let's register it , since whenever you install a plugin you need to register it. 
 5. Let's head over to `app.js` and import it `const  fastifySwagger= require('fastify-swagger');`
 6. Then we register it inside the build function and expand the build function to also receive the options for *fastify-swagger* :
 ```
 const  build =(opts={}, optsSwagger={})=>{
	const  app= fastify(opts);
	app.register(fastifySwagger, optsSwagger);
	app.register(itemRoutes);
	return  app;
};
 ```

7. Head over to the `server.js` file and add the parameters for the build function :
```
const  app = build(
	{
		logger:  true
	},
	{
		exposeRoute:  true,
		routePrefix:  "/docs",
		swagger:
		{
			info: { title:  "Fastify API", version:  "1.0.0" }
		}
});
```
**exposeRoute**: will enable the documentation route.
**routePrefix** : The route you call to view the Swagger page on a browser.
**swagger**: Is to set information as the title and the version of the API. 

## Add POST endpoint
Now well create a POST endpoint to add item to our items. 

 1. Go to routes and create a new POST route :
 ```
 fastify.post("/", postItemOpts, (request, reply) => {
	const { name, description } = request.body;
	const  item = { id:  String(items.length + 1), name, description };
	items.push(item);
	reply.code(201).send(item);
});
 ```
2. Create postItemOpts , where we what to return the *item* with the *status code 201 Created*:
```
const  postItemOpts = {
	schema: {
		response: {
		201:  Item,
		},
	},
};
```

3. Test it out by writing a POST request with a request body (JSON object) in the `test.http` file : 
```
POST http://localhost:3000/ HTTP/1.1
Content-Type:  application/json 

{
	"name": "New Item",
	"description": "New Item Description"
}
```

## Add body validation on the POST endpoint
We want to ensure that when a user adds a new item , the item name and description is supplied else we won't accept it. 

This can be done by updating the *postItemOpts* schema to also validate the request body:
```
const  postItemOpts = {
	schema: {
	body:{
		type:  "object",
		required: ["name", "description"],
		properties: {
			name: { type:  "string" },
			description: { type:  "string" },
			}
	},
	response: {
		201:  Item,
		},
	},
};
```  
Where we set that the request body will be the type of `'object'` , the required fields are both `["name", "description"]`  and they need to be the type of `string`.

Let's try it out by commenting out the name in the JSON body, and we'll see a 400 error status code with the following message : 
```
{  
	"statusCode": 400,
	"error": "Bad Request",
	"message": "body should have required property 'name'" 
}
```

## Create delete and update endpoints 
We'll create a delete endpoint which will return a simple message that the item has been deleted: 
**Create the DELETE route** 
```
fastify.delete("/:id", deleteItemOpts, (request, reply) => {
	const {id} = request.params;
	items= items.filter((item) =>  item.id !== id);
	reply.send(`Item ${id} deleted`);
});
```

**Create the deleteItemOpts**
```
const  deleteItemOpts = {
	schema: {
		response: {
			200: {
				type:  "object",
				properties: {
				message: { type:  "string" },
				},
			},
		},
	},
};
``` 
**Add a DELETE request in the `test.http` file**
`DELETE http://127.0.0.1:3000/1 HTTP/1.1`

Next we create the update item endpoint :
**Create UPDATE route**
```
fastify.put("/:id", updateItemOpts, (request, reply)=>{
	const {id}= request.params
	const {name, description}= request.body
	const  item = items.find((item)=>  item.id === id)
	item.name = name
	item.description = description
	reply.send(item)
})
```

**Create updateItemOpts**
```
const  updateItemOpts = {
	schema: {
	body:{
		type:  "object",
		required: ["name", "description"],
		properties: {
			name: { type:  "string" },
			description: { type:  "string" },
			}
	},
	response: {
		201:  Item,
		},
	},
};
```
**Add UPDATE request in the `test.http` file** 
```
PUT http://localhost:3000/2 HTTP/1.1
Content-Type:  application/json 
{
	"name": "New Item",
	"description": "New Item Description"
}
```
## Celebrate your achievement 🥳 
And there you have it a fully operational CRUD web-application with fastify 🥳🙌🎉 

## Dockerize the application 
1. Inside the root of our porject file structure we'll create a new file called `Dockerfile`.

2. Inside the `Dockerfile` we first define the base image which we want to build from, in this case we check what version of node we have installed `node --version` and use the same version `FROM node:14.16.0`

3. Next we create a directory to hold the application code inside the image, this will be the working directory for your application:
```
# Create app directory
WORKDIR /usr/src/app
```

4. The base image that we hare using comes with *Node.js* and *npm* preinstalled, so we can copy over both `package.json` and `package-lock.json` inside our image:
```
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
```
This in order to install all our depencides by supplying the command `RUN npm install`, just like we do in our terminal.

If you are building your code for production :
`RUN npm ci --only=production`

5. Next we bundle our application source code inside the Docker image , by running the command : 
```
# Bundle app source
COPY . .
```

6. Our application binds to the port 3000, so we'll use the `EXPOSE` instruction to have it mapped by the docker deamon:
`EXPOSE 8080`

7. Finally we define the command to run our application , by using the `CMD` which defines our runtime. We first take a look at our `package.json` file in order to know which command to pass, in our case it's : 
`CMD ["node", "src/server.js"]`

8. We create a `.dockerignore` file , which works just like .gitignore file. Tell docker to not copy over local modules and debug logs into the image:
```
node_modules
npm-debug.log
```

9. Now in our terminal we'll tell Docker to build our image, by running the command:
`docker build . -t <your username>/node-web-app`

- `.` : Telling Docker cli on the current directory.
- `-t` : Let's you tag the image so it's eaiser to find. 

10. Run `docker iamges` to view your created image.

11. It's time to run our create image as a container, by running the following command : 
`docker run -p 8080:3000 -d <your username>/node-web-app`

- `-p` : Port mapping which redirect a public port to a private private port. In this case we can use 8080 as public and 3000 as the private one based on our EXPOSE and what we have set inside our application `-p 8080:3000`

- `-d` : Runs the container in detacted mode, allowing you to use the terminal for other tasks. Without it you will see the log of the application running just as we have seen when running it on our local environment. 

12. To see our Docker container running we'll use `docker ps`, and we also copy the container id.

13. We use the container id together with `docker logs <container id>` to view the log and app output. 

14. We can go inside the container, by running : `docker exec -it <container id> /bin/bash`

15. We'll call `docker logs <container id>` in order to see the output , and update our `test.http` file to call get all items. 

We'll see that the request failed and we get a message of *socket hang up*, 

The reason for this error is that *fastify* is setup by default to listen *only* on the localhost of `127.0.0.1` interface. 

To listen on all available IPv4 interface , we need to modify our `fastify.listen` call like this :
`app.listen(3000, '0.0.0.0', (err, address) => {`

16. Let's rebuild our image in order to include our changes and test it out again : `docker build . -t habbex/node-web-app`. Notice it when much quicker, it's due to Docker is caching the diffirent step. 

17. Let's run `docker ps` to see if you have any old container, and let's clear them out with `docker container prune`. 

18. Let's run our application again : `docker run -p 8080:3000 -d <your username>/node-web-app`.  

## Celebrate your achievement 🥳 
And there you have it a you have dockerized your web-application 🥳🙌🎉 

