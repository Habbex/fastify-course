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

    