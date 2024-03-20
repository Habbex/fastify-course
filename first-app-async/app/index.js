const fs = require("fs");
const fsPromises = fs.promises;
const {setTimeout} = require("timers/promises");

/**
 * Reading a json file and return content
 *
 * @param {String} path
 * @returns {Object}
 */
function readJsonFile(path) {
  try {
    const data = fs.readFileSync(path, { encoding: "utf8" });
    return JSON.parse(data);
  } catch (err) {
    console.error("Somethig went wrong while reading the file in sync");
    return [];
  }
}

/**
 *
 * Reading JSON file in a non blocking way
 *
 * @param {String} path
 * @returns {Object}
 */
async function readJsonFileAsync(path) {
  try {
    await setTimeout(2000)// Simulate a 2-second delay
    const data = await fsPromises.readFile(path, {
      encoding: "utf8",
    });
    return JSON.parse(data);
  } catch (err) {
    console.error("Somethig went wrong while reading the file in async");
    return [];
  }
}

async function delayedConsoleLog(){
  await setTimeout(5000)
  console.warn("I waited five seconds for this!")
}

module.exports = {
  readJsonFile,
  readJsonFileAsync,
  delayedConsoleLog
};
