const { readJsonFile, readJsonFileAsync, delayedConsoleLog } = require("./app");


/**
 *
 * We are waiting for the file to be read first and then we continue calculations
 *
 */
console.log("[INFO] Reading contents of the file in a blocking way.");
const data1 = readJsonFile("./app/data.json");
console.log(data1)

/**
 * We waiting for the file to be read and when the operation is done we print the result out
 *
 */
console.log(
  "[INFO] Start to read file in an async way and continue with the script exec until the operation finishes"
);
readJsonFileAsync("./app/data.json").then((res) => {
  console.log("[INFO] File read successfully in an async way after waiting.");
  console.log(res);
}).catch((error) => {
  console.error("Error reading file asynchronously:", error);
});

console.log("[INFO] This message prints immediately, not waiting for the file to be read.");


delayedConsoleLog()

