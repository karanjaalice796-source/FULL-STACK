//ex1: Basic Module System
// greeting.js
function greet(name) {
    return `Hello, ${name}! Welcome to Node.js modules.`;
}

module.exports = greet;

// app.js
const greet = require('./greeting');

console.log(greet('Alice'));

//ex2: Using an NPM Module
// colorful-message.js
const chalk = require('chalk');

function displayColorfulMessage() {
    console.log(chalk.blue.bold('This is a fantastic colorful message using Chalk!'));
}

module.exports = displayColorfulMessage;

// app.js
const displayColorfulMessage = require('./colorful-message');

displayColorfulMessage();

//ex3: Advanced File Operations
// read-file.js
const fs = require('fs');
const path = require('path');

function readFileContent() {
    const filePath = path.join(__dirname, 'files', 'file-data.txt');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(data);
        return data;
    } catch (err) {
        console.error('Error reading the file:', err.message);
    }
}

module.exports = readFileContent;

// app.js
const readFileContent = require('./read-file');

readFileContent();