import { rmdirSync, existsSync } from "fs";
import { join } from "path";
import readline from "readline";

const routeName = process.argv[2];

const greenText = "\x1b[32m";   // Green
const redText = "\x1b[31m";     // Red
const yellowText = "\x1b[33m";  // Yellow
const resetText = "\x1b[0m";    // Reset to default

if (!routeName) {
  console.error("Please provide a route name.");
  process.exit(1);
}

const routeFolderPath = join(__dirname, "../routes", routeName);

if (!existsSync(routeFolderPath)) {
  console.error(`The route "${routeName}" does not exist.`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



rl.question(`Are you sure you want to ${redText}delete${resetText} the route ${yellowText}"${routeName}"${resetText}? \nType the route name to confirm: `, (answer) => {
    if (answer === routeName) {
    rmdirSync(routeFolderPath, { recursive: true });
    console.log(`${greenText}Route ${yellowText}"${routeName}"${greenText} has been ${redText}deleted${greenText} successfully.${resetText}`);
  } else {
    console.log(`${yellowText}Confirmation failed. Route not deleted.${resetText}`);
  }
  rl.close();
});
