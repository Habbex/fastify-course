# Async/Await in Node.js: A Beginner's Guide

Asynchronous programming is a fundamental concept in Node.js, enabling non-blocking operations and efficient handling of I/O-bound tasks. This tutorial introduces you to the async/await syntax, making async programming more readable and easier to manage.

## Prerequisites

- Basic knowledge of JavaScript and Node.js
- Node.js installed on your machine
- A text editor (e.g., VS Code, Sublime Text)

## Understanding Asynchronous Programming

In Node.js, operations like reading files, querying a database, or making HTTP requests are asynchronous. These operations can take time to complete, and you don't want your program to halt execution while waiting for these tasks to finish. Asynchronous programming allows other code to run in the meantime.

## Callbacks and Promises: The Precursors

Before async/await, asynchronous operations were handled using callbacks and promises.

- **Callbacks** are functions passed as arguments to another function, executed after the completion of an asynchronous operation.
- **Promises** are objects representing the eventual completion or failure of an asynchronous operation, improving on callbacks with a more readable and manageable structure.

## Introducing Async/Await

Async/await is syntactic sugar built on top of promises, making asynchronous code look and behave like synchronous code. It simplifies the chaining of promises and handling of asynchronous operations.

### Async Functions

An `async` function is a function declared with the `async` keyword. It always returns a promise. If the function returns a value, the promise will be resolved with that value. Here's a simple example:

```javascript
async function greet() {
  return "Hello, world!";
}
```

### Await Operator

The `await` operator is used inside async functions to wait for a promise to settle (resolve or reject). It pauses the execution of the async function, waiting for the promise to resolve, and then resumes the async function's execution and returns the resolved value.

Here's how you use `await`:

```javascript
async function getGreeting() {
  const greeting = await greet();
  console.log(greeting); // "Hello, world!"
}
```

## Practical Example with File Reading in Node.js

In this section, we'll apply async/await to a practical example involving reading a JSON file in Node.js. We'll use your provided code to demonstrate synchronous and asynchronous file reading from a directory named `app`.

### Setup

Ensure you have the following file structure:

- `index.js`
- `app/`
  - `index.js` (functions for reading files)
  - `data.json` (your JSON file)

### app/index.js

Inside `app/index.js`, we define functions for reading a JSON file synchronously and asynchronously using the `fs` module and its promise-based counterpart `fs.promises`.

#### Synchronous File Reading Function

```javascript
const fs = require("fs");

function readJsonFile(path) {
  try {
    const data = fs.readFileSync(path, { encoding: "utf8" });
    return JSON.parse(data);
  } catch (err) {
    console.error("Something went wrong while reading the file in sync");
    return [];
  }
}

// export the module
module.exports = {
  readJsonFile
};

```

This function blocks the execution until the file is read completely, which might not be ideal for I/O-heavy applications.

#### Asynchronous File Reading with Async/Await

```javascript
const fsPromises = fs.promises;

// readJsonFile function

async function readJsonFileAsync(path) {
  try {
    const data = await fsPromises.readFile(path, {
      encoding: "utf8",
    });
    return JSON.parse(data);
  } catch (err) {
    console.error("Something went wrong while reading the file in async");
    return [];
  }
}

// Export the module
module.exports = {
  readJsonFile,
  readJsonFileAsync // Add the new function here.
};
```

This function uses async/await to read a file without blocking the execution. It leverages the promise-based `fs.promises.readFile` method.

### Simulating a Waiting Process
We'll modify the `app/index.js` file to include a simulated delay in the asynchronous file reading function. This delay will use `setTimeout`, to mimic a longer-running asynchronous operation, such as querying a database or accessing a remote API.

Updated app/index.js with Simulated Delay
We include the function `setTimeout` with a delay in miliseconds from the module `require("timers/promises");`.
```javascript
const {setTimeout} = require("timers/promises");

// readJsonFile function

async function readJsonFileAsync(path) {
  try {
    await setTimeout(2000)// Simulate a 2-second delay
    const data = await fsPromises.readFile(path, {
      encoding: "utf8",
    });
    return JSON.parse(data);
  } catch (err) {
    console.error("Something went wrong while reading the file in async");
    return [];
  }
}
```

We also create another function with a delayed console.log response:
```javascript
// readJsonFile function

// readJsonFileAsync function

async function delayedConsoleLog(){
  await setTimeout(5000)// Simulate a 5-second delay
  console.warn("[INFO] I waited five seconds for this!")
}

// export modules
module.exports = {
  readJsonFile,
  readJsonFileAsync,
  delayedConsoleLog // Add the new function here.
};
```

### Using non Async/Await function in Your Application (index.js)
In the `index.js`, you'll utilize `readJsonFile` to read `./app/data.json` in a synchonous way:
```javascript
console.log("[INFO] Reading contents of the file in a blocking way.");
const data1 = readJsonFile("./app/data.json");
console.log(data1)
```

### Using Async/Await in Your Application (index.js)

In `index.js`, you'll utilize `readJsonFileAsync` to read `./app/data.json` asynchronously. This allows the script to execute other operations while waiting for the file reading to complete, like the `console.log` bellow the `readJsonFileAsync` function. 

```javascript
const { readJsonFile, readJsonFileAsync } = require("./app");

console.log("[INFO] Start to read file in an async way and continue with the script exec until the operation finishes");

readJsonFileAsync("./app/data.json").then((res) => {
  console.log("[INFO] File read successfully in an async way.");
  console.log(res);
});

console.log("[INFO] This message prints immediately, not waiting for the file to be read.");
delayedConsoleLog()
```

This code initiates the asynchronous reading of `data.json`. While the file is being read, the script can continue to execute. Once the reading is complete, the contents of the file are logged to the console.

### Conclusion

By leveraging async/await, you can perform file reading and other operations in Node.js both synchronously and asynchronously, depending on your application's needs. Asynchronous operations are particularly useful for improving the performance of I/O-bound applications, making your code more efficient and non-blocking.