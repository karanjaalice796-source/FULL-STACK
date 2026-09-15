//ex1. Hello, World Program
const message: string = "Hello, World!";
console.log(message);

//ex2. Type Annotations
let age: number = 30;
let personname: string = "Alice";

console.log(`Name: ${personname}`);
console.log(`Age: ${age}`);

//ex3. Union Types
let id: string | number;

id = "USER-123"; 
console.log(id);

id = 1042; 
console.log(id);

//ex.4. Control Flow with if...else
function checkNumber(num: number): string {
    if (num > 0) {
        return "Positive";
    } else if (num < 0) {
        return "Negative";
    } else {
        return "Zero";
    }
}

console.log(checkNumber(10));
console.log(checkNumber(-5));
console.log(checkNumber(0));

//ex5. Tuples types
function getDetails(name: string, age: number): [string, number, string] {
    const greeting = `Hello, ${name}! You are ${age} years old.`;
    return [name, age, greeting];
}

const details = getDetails("Alice", 25);
console.log(details); 

//Ex6: Object Type Annotations
type Person = {
    name: string;
    age: number;
};

function createPerson(name: string, age: number): Person {
    return { name, age };
}

const person = createPerson("Bob", 28);
console.log(person);

//ex7. Type Assertions
const inputElement = document.getElementById("username-input") as HTMLInputElement;

if (inputElement) {
    inputElement.value = "TypeScriptDeveloper";
    console.log(inputElement.value);
}

//ex8. switch Statement with Complex Conditions
function getAction(role: string): string {
    switch (role.toLowerCase()) {
        case "admin":
            return "Manage users and settings";
        case "editor":
            return "Edit content";
        case "viewer":
            return "View content";
        case "guest":
            return "Limited access";
        default:
            return "Invalid role";
    }
}

console.log(getAction("admin"));  
console.log(getAction("editor"));
console.log(getAction("viewer"));
console.log(getAction("guest"));
console.log(getAction("unknown"));

//Ex9: Function Overloading with Default Parameters
function greet(name: string): string;
function greet(): string;

function greet(name: string = "Guest"): string {
    return `Hello, ${name}!`;
}

console.log(greet("Alice"));
console.log(greet());