import { rmdirSync, existsSync, readFileSync, writeFileSync } from "fs";
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
  console.error(`${redText}The route "${routeName}" does not exist.${resetText}`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`Are you sure you want to ${redText}delete${resetText} the route ${yellowText}"${routeName}"${resetText}? \nType the route name to confirm: `, (answer) => {
  if (answer === routeName) {
    // Remove the route folder
    rmdirSync(routeFolderPath, { recursive: true });
    console.log(`${greenText}Route ${yellowText}"${routeName}"${greenText} has been ${redText}deleted${greenText} successfully.${resetText}`);

    // Path to the main index.ts file
    const mainIndexPath = join(__dirname, "../index.ts");

    // Read the current content of the main index.ts
    let mainIndexContent = readFileSync(mainIndexPath, 'utf-8');

    // Remove the import statement for the deleted route
    const importStatement = `import ${routeName}Route from './routes/${routeName}';\n`;
    mainIndexContent = mainIndexContent.replace(importStatement, '');

    // Remove the .group() statement related to the deleted route
    const groupStatementRegex = new RegExp(`\\.group\\('/api',\\s*\\(app\\)\\s*=>\\s*app\\.use\\(${routeName}Route\\)\\)`, 'g');
    mainIndexContent = mainIndexContent.replace(groupStatementRegex, '');

    // Write the updated content back to the main index.ts
    writeFileSync(mainIndexPath, mainIndexContent);

    console.log(`${greenText}Updated main index.ts to remove the route ${yellowText}"${routeName}"${greenText}.${resetText}`);
  } else {
    console.log(`${yellowText}Confirmation failed. Route not deleted.${resetText}`);
  }
  rl.close();
});
