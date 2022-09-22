const { readJsonFile, readJsonFileAsync, delayedConsoleLog } = require("./app");

/**
 * We waiting for the file to be read and when the operation is done we print the result out
 *
 */
console.log(
  "[INFO] Start to read file in an async way and continue with the script exec until the operation finishes"
);
readJsonFileAsync("./app/data.json").then((res) => {
  console.log("[INFO] File read succesfully in an async way.");
  console.log(res);
});

/**
 *
 * We are waiting for the file to be read first and then we continue calculations
 *
 */
console.log("[INFO] Reading contents of the file in a blocking way.");
const data1 = readJsonFile("./app/data.json");
const data2 = readJsonFile("./app/data.json");
console.log(data1)
console.log(data2)

delayedConsoleLog()

