import { writeFileSync, mkdirSync, existsSync, appendFileSync, readFileSync } from "fs";
import { join } from "path";

// Get the route name from the command line arguments
const routeName = process.argv[2];

const greenText = "\x1b[32m";   // Green
const redText = "\x1b[31m";     // Red
const yellowText = "\x1b[33m";  // Yellow
const resetText = "\x1b[0m";    // Reset to default

if (!routeName) {
    console.error("Please provide a route name.");
    process.exit(1);
}

// Define the folder path inside the src/routes directory
const routeFolderPath = join(__dirname, "../routes", routeName);

// Check if the folder already exists
if (existsSync(routeFolderPath)) {
    console.error(`The route "${routeName}" already exists.`);
    process.exit(1);
}

// Create the route folder
mkdirSync(routeFolderPath, { recursive: true });

// Define file paths
const indexPath = join(routeFolderPath, "index.ts");
const modelPath = join(routeFolderPath, "model.ts");
const servicePath = join(routeFolderPath, "service.ts");

// Content for the route files
const indexContent = 
`import Elysia from "elysia";
import { Create, Read, ReadAll, Update, Delete } from "./service";
import { Model } from "./model";

export default new Elysia({prefix: '/${routeName}'})
    .use(Model)
    .get('/', (params) => ReadAll(params), {})
    .get('/:id', (params) => Read(params), {})
    .post('/', (params) => Create(params), {})
    .patch('/', (params) => Update(params), {})
    .delete('/', (params) => Delete(params), {});
`;

const modelContent = 
`import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        your_model_name: t.Object({
            key: t.String(),
        })
    })
`;

const serviceContent = 
`export async function Create(params:any) {
    return 'hello create'
}
export async function Read(params:any) {
    return 'hello read'
}
export async function ReadAll(params:any) {
    return 'hello readAll'
}
export async function Update(params:any) {
    return 'hello update'
}
export async function Delete(params:any) {
    return 'hello delete'
}
`;

// Create and write content to the files
writeFileSync(indexPath, indexContent);
writeFileSync(modelPath, modelContent);
writeFileSync(servicePath, serviceContent);

console.log(`${greenText}Route ${yellowText}"${routeName}"${greenText} created successfully with index.ts, model.ts, and service.ts files.${resetText}`);

// Path to the main index.ts file
const mainIndexPath = join(__dirname, "../index.ts");

// Read the current content of the main index.ts
let mainIndexContent = readFileSync(mainIndexPath, 'utf-8');

// Add the import statement at the top of the main index.ts
const importStatement = `import ${routeName}Route from './routes/${routeName}';\n`;

if (!mainIndexContent.includes(importStatement)) {
    mainIndexContent = importStatement + mainIndexContent;
}

// Add the .group() statement at the bottom of the main index.ts
const groupStatement = `\n    .group('/api', (app) => app.use(${routeName}Route))`;

if (!mainIndexContent.includes(groupStatement)) {
    mainIndexContent = mainIndexContent.trim() + groupStatement + '\n';
}

// Write the updated content back to the main index.ts
writeFileSync(mainIndexPath, mainIndexContent);

console.log(`${greenText}Updated main index.ts with the new route ${yellowText}"${routeName}"${greenText}.${resetText}`);
