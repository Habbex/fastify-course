# Fastify course

This readme will explain how to create a simple web-application using node.js and Fastify.js framework. 

## Create git repository
Well create a new git repository to source version control our code.

## Setup the project.
Once the Github repo is setup we clone the repo to our development machine and run `npm init` and hit accept on every step.

We install nodemon as a *dev dependency*  : `npm i nodemon --save-dev`, for rapid development. 

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

The `app.js` file is where we will add all our routes and plugins, in order to have them later on being initialized in a common build function inside `app.js`  which we import to the `server.js` file and listen to.

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
	 
 3.  Then inside the `server.js` file we'll import the `app.js` and it's common build function, and call and pass in the the fastify option `{ logger:  true }` .  Then we update the rest of the file to use const app instead of fastify:
 ```
const { build } = require("./app"); 
const  app = build({ logger:  true });

// Delcare a route
app.get("/", (request, reply) => {
	return { hello:  "world" };
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
 2.  Inside the `items.js` we create a function which we call *itemRoutes*, which takes in fastify, options  and a callback of done with we add in the end of the function: 
 ```
const itemRoutes=(fastify,options, done)=>{
	fastify.get('/' , (request, reply)=>{
	return { hello:  "world" };
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
let  items = [
	{id:  '1', name:  'Item 1', description:  'Item 1 description'},
	{id:  '2', name:  'Item 2', description:  'Item 2 description'},
	{id:  '3', name:  'Item 3', description:  'Item 3 description'},
]
module.exports= items;
```
Which we will create in the *src* folder.

1. Let's add GET by *id* in order to test it out. Well get the *id* by accessing the *request bodys params* , and we'll use destructing to get the id being passed in the request body : `const { id } = request.params;`
2.  We'll use a simple find function to filter out based on *id* to return the requested *item*: 
```
fastify.get("/:id", (request, reply) => {
	const { id } = request.params;
	const  item = items.find((item) =>  item.id === id);
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
				type:  "object",
					properties: {
						id: { type:  "string" },
						name: { type:  "string" },
						description: { type:  "string" },
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
const  getItemOpts = {
schema: {
	response: {
		200: {
			type:  "object",
			properties: {
				id: { type:  "string" },
				name: { type:  "string" },
				description: { type:  "string" },
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
        items: { Item },
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


