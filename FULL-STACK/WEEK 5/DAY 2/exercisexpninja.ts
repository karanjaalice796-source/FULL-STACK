//Ex1: Conditional Types
type MappedType<T> = T extends number ? number : T extends string ? number : never;

// Implement the function using the conditional type and generic constraints
function mapType<T extends number | string>(value: T): MappedType<T> {
    if (typeof value === "number") {
        // If it's a number, return its square
        return (value * value) as MappedType<T>;
    } else {
        // If it's a string, return its length
        return (value.length) as MappedType<T>;
    }
}

// Test the function
const squaredNumber = mapType(5); 
const stringLength = mapType("Hello");

console.log(squaredNumber);
console.log(stringLength);

//Ex2: Keyof and Lookup Types
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// Test the function
const user = {
    id: 1,
    username: "coder123",
    isActive: true
};

const userId = getProperty(user, "id"); 
const username = getProperty(user, "username");

console.log(userId); 
console.log(username); 

//Ex3: Using Interfaces with Numeric Properties
interface HasNumericProperty {
    [key: string]: number;
}

// Implement a function that multiplies a specific numeric property by a factor
function multiplyProperty(obj: HasNumericProperty, key: string, factor: number): number {
    if (key in obj) {
        return obj[key] * factor;
    }
    throw new Error(`Property "${key}" does not exist or is not a number.`);
}

// Test the function
const product = {
    price: 50,
    quantity: 4,
    discount: 10
};

console.log(multiplyProperty(product, "price", 2));  
console.log(multiplyProperty(product, "quantity", 1.5)); 