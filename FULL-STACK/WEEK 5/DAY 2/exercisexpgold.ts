//Ex1: Union Types
function processValue(value: string | number): string {
    if (typeof value === "number") {
        // Format the number as currency with two decimal places
        return `$${value.toFixed(2)}`;
    } else {
        // Split the string into an array of characters, reverse it, and join back together
        return value.split("").reverse().join("");
    }
}

// Test the function
console.log(processValue(150.5));  
console.log(processValue("TypeScript")); 

//Ex2: Array Type Annotations
function sumNumbersInArray(arr: (number | string)[]): number {
    let sum = 0;
    
    for (const item of arr) {
        // Use a type guard to check if the current item is a number
        if (typeof item === "number") {
            sum += item;
        }
    }
    
    return sum;
}

// Test the function
const mixedArray = [10, "hello", 20, "world", 5.5];
console.log(sumNumbersInArray(mixedArray));

//Ex3: Type Aliases
type AdvancedUser = {
    name: string;
    age: number;
    address?: string;
};

function introduceAdvancedUser(user: AdvancedUser): string {
    let message = `Hello, my name is ${user.name} and I am ${user.age} years old.`;
    
    // Check if the optional address property is present
    if (user.address) {
        message += ` I live at ${user.address}.`;
    }
    
    return message;
}

// Test the function with and without an address
const userWithAddress: AdvancedUser = { name: "Alice", age: 30, address: "123 Main St" };
const userWithoutAddress: AdvancedUser = { name: "Bob", age: 25 };

console.log(introduceAdvancedUser(userWithAddress)); 
console.log(introduceAdvancedUser(userWithoutAddress)); 

//Ex4: Optional Parameters.
function welcomeUser(name: string, greeting?: string): string {
    const finalGreeting = greeting ? greeting : "Hello";
    
    return `${finalGreeting}, ${name}!`;
}

// Test the function
console.log(welcomeUser("Charlie")); 
console.log(welcomeUser("Diana", "Welcome"));

