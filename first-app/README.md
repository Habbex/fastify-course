# Setting up your first basic Node.js app

## Basic Node.js app

1. Open terminal and run  `npm init` to initialize the setup of a new node.js application.   
2. Create a new file and call it `index.js`
3. Inside the `index.js` file, write the JavaScript command `console.log("Hello world")`
4. Inside the `package.json` add a new ___npm script___ inside scripts section like below: 
	```json
	"scripts": {
		"start": "node index.js",
		"test": "echo \"Error: no test\" && exit 1"
	},
	```

5. In our terminal run the npm script command `npm start`, and you will see the terminal returning the `Hello world` string. 

 
## Modularization of your Node.js app 1
Now that we have our index.js file, it is time to level up our game 😀! 

Let’s create something more complex by splitting our source code into multiple JavaScript files with the purpose of readability and maintainability.

### Let's start with expanding our code to be able to sum an array of numbers.

1. Create a new folder called `app`

2. Inside the `app` folder create a new JavaScript file called `index.js`.

3. Inside the `index.js` file we will create an array objects with number you what to sum:
	```
	const numbersToAdd=[
		1, 2, 3, 4, 5
	]
	```
4. These array objects will be used as variables for our functions which we will create, let's start with creating a function to sum all the numbers in the array object `numbersToAdd`.

5. Inside the `app` folder create a new JavaScript file called `calc.js`, inside of the file we will create our first function.
    
    ```
        function sum(arr){
        return arr.reduce(function(a,b){
            return a + b
        },0)
    }

    module.exports.sum = sum 
    ```
    The function above takes the array object as parameter and will run `.reduce` method , adding the next element to the preceding element with the inital element having the value of 0.

    The final result of running the reducer across all the elements of an array is a single value, you can read more about `reduce` [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).

    We need to expose/export our function/module so we can import and use it in our `index.js` file, this is done by writting `module.exports.sum = sum`.

6. Back to `app/index.js` well import our `calc.js` module containing our function `sum`, by writting the following on the top of the file : `const calc = require('./calc')`

7. To use our imported function we create a new varaible called `resultSum` and asign the returning value of the `sum` function which will be using the array object `numbersToAdd` as it's parameter: `const result = calc.sum(numbersToAdd)`

8. Let's print out the result of the `sum` function : 
    ```
    console.log(`The result of the sum is ${resultSum}`)
    ```
9. Since we have the main entrypoint of our app listed as `index.js`, we need to to import our `app/index.js` file so it runs and prints out our result. So on the top of the `index.js` file add the following `require('./app/index')`

10. Run `npm start` and you will see your result in the terminal 🥳

## Modularization of your Node.js app 2

Let's level up more 😀!

### Let's expand our application to also concatenate two arrays.

1. We will be using `lodash` in order to concatenate two arrays, since it already solves this problem for us 😉.
To use `lodash` we need to first download it by running `npm install lodash`, and inspect that it has been added inside our `package.json`file.

2. Inside the `app/index.js` file create 2 new array objects , which we will use to concatenate together: 
	```
	const numbersToContact1=[
		1, 2, 3, 4, 5
	]
		const numbersToContact2=[
		6, 7, 8, 9, 10
	]
	```
3. Inside the `app` folder create a new JavaScript file called `concat.js` and navigate into it.

4. Inside the `concact.js` file we will first import the `lodash` package: `const _ = require('lodash')`

5. Then we create a new function called `concat` with two parameters `arr1` and `arr2` :
    ```
    const _ = require('lodash')

    function concat(arr1, arr2){
        return _.concat(arr1, arr2)
    }

    module.exports.concat = concat 
    ```
6. We export the concat function : `module.exports.concat = concat`

7. We import the `concat` module to be able to use the `contact` function on the top of the `app/index.js` file : `const concat = require('./concat')`

8. To use our imported function we create a new varaible called `resultConcat` and asign the returning value of the `concat` function which will be using the array objects `numbersToContact1` and `numbersToContact2` as it's parameters: `const resultConcat = concat.concat(numbersToContact1, numbersToContact2)`

9. Let's print the value of `resultConcat`:
    ```
    console.log(`The result of the sum is ${resultConcat}`)
    ```
10. Run `npm start` and you will see your result in the terminal 🥳

## Run your Node.js application in development mode 😎

The best way of developing a node.js application is to setup and use `nodemon`, which is a utility that will monitor your application for any changes and automatically restart your server. 

1. To install and add `nodemon` to your project run the following command in the terminal : `npm install nodemon`, and check the `package.json` that it has been added. 

2. Create a new npm script with the name `dev` and supply it with the following command : `"nodemon index.js"` as seen below : 
```
  "scripts": {
    "start": "node index.js",
    "dev" : "nodemon index.js",
    "test": "echo \"Error: no test\" && exit 1"
  },
```

3. Run your Node.js application in development mode , by running the command `npm run dev` in the terminal. 

4. Change something in your code , for example update on of the arrays for either sum or conact functions.

5. You will see that the server has restarted and the new values have been read. 
