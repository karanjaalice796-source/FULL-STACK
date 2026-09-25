//Exercise 1: Multiple Exports and Import using CommonJS syntax
//1. products.js
const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Coffee Maker', price: 49.99, category: 'Kitchen' },
  { id: 3, name: 'Running Shoes', price: 89.99, category: 'Sports' }
];

module.exports = products;

//Exercise_1/shop.js
const products = require('./products');

function findProductByName(productName) {
  const found = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
  if (found) {
    console.log(`Product Found: Name: ${found.name}, Price: $${found.price}, Category: ${found.category}`);
  } else {
    console.log(`Product "${productName}" not found.`);
  }
}

findProductByName('Laptop');
findProductByName('Coffee Maker');

//Exercise 2: Advanced Module Usage
//Exercise_2/data.js
export const persons = [
  { name: 'Alice', age: 25, location: 'New York' },
  { name: 'Bob', age: 30, location: 'London' },
  { name: 'Charlie', age: 35, location: 'Paris' }
];

//Exercise_2/app.js
import { persons } from './data.js';

function calculateAverageAge(people) {
  if (people.length === 0) return 0;
  const totalAge = people.reduce((sum, person) => sum + person.age, 0);
  const average = totalAge / people.length;
  console.log(`The average age is: ${average.toFixed(2)} years`);
}

calculateAverageAge(persons);

//Exercise 3: File Management
//Exercise_3/fileManager.js
const fs = require('fs');

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`Content of ${filePath}:\n${data}`);
    return data;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
  }
};

const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully wrote to ${filePath}`);
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err.message);
  }
};

module.exports = { readFile, writeFile };

//Exercise_3/app.js
const { readFile, writeFile } = require('./fileManager');

readFile('Hello World.txt');
writeFile('Bye World.txt', 'Writing to the file');
readFile('Bye World.txt');

//Exercise 4: Todo List
export class TodoList {
  constructor() {
    this.tasks = [];
  }

  addTask(taskDescription) {
    this.tasks.push({ description: taskDescription, completed: false });
    console.log(`Added task: "${taskDescription}"`);
  }

  markAsComplete(index) {
    if (this.tasks[index]) {
      this.tasks[index].completed = true;
      console.log(`Marked task ${index + 1} as complete.`);
    } else {
      console.log('Task not found.');
    }
  }

  listTasks() {
    console.log('\n--- Todo List ---');
    this.tasks.forEach((task, index) => {
      const status = task.completed ? '[X]' : '[ ]';
      console.log(`${index + 1}. ${status} ${task.description}`);
    });
    console.log('-----------------\n');
  }
}

//Exercise_4/todoApp/app.js
import { TodoList } from './todo.js';

const myTodoList = new TodoList();

myTodoList.addTask('Learn Node.js modules');
myTodoList.addTask('Build a Todo application');
myTodoList.listTasks();

myTodoList.markAsComplete(0);
myTodoList.listTasks();

//Exercise_5/math-app/app.js
const _ = require('lodash');
const { add, multiply } = require('./math');

console.log(`Addition: ${add(10, 5)}`);
console.log(`Multiplication: ${multiply(4, 3)}`);

const numbers = [12, 45, 6, 89, 23];
console.log(`Max number using lodash: ${_.max(numbers)}`);

//Exercise 6: Chalk Package Usage
const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));
console.log(chalk.red.bold('This is an important alert message.'));
console.log(chalk.green.bgBlack(' Success: Task completed successfully! '));

//Exercise 7: File-Explorer & Utilities
//Exercise_7/copy-file.js
const fs = require('fs');

try {
  const content = fs.readFileSync('source.txt', 'utf8');
  fs.writeFileSync('destination.txt', content, 'utf8');
  console.log('Successfully copied content from source.txt to destination.txt');
} catch (err) {
  console.error('Error during file copy:', err.message);
}

//Exercise_7/read-directory.js
const fs = require('fs');

try {
  const files = fs.readdirSync(__dirname);
  console.log('Files in the current directory:');
  files.forEach(file => console.log(`- ${file}`));
} catch (err) {
  console.error('Error reading directory:', err.message);
}