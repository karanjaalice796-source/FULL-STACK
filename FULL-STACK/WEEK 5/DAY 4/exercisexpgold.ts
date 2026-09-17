// Keep this exercise separate from the other Day 4 examples and DOM interfaces.
export {};

//Ex1: Combining Intersection Types with Type Guards
interface User {
  name: string;
  email: string;
}

interface Admin {
  adminLevel: number;
}

// Combine interfaces using an intersection type
type AdminUser = User & Admin;

function getProperty(obj: AdminUser, propertyName: string): any {
  // Use a type guard / property check
  if (propertyName in obj) {
    return obj[propertyName as keyof AdminUser];
  }
  return undefined;
}

const adminUserInstance: AdminUser = {
  name: "Alice",
  email: "alice@example.com",
  adminLevel: 5
};

console.log(getProperty(adminUserInstance, "name"));
console.log(getProperty(adminUserInstance, "adminLevel"));
console.log(getProperty(adminUserInstance, "phone"));

//Ex2: Type Casting with Generics
function castToType<T>(value: any, caster: (val: any) => T): T {
  return caster(value);
}

// Casting a string to a number
const numericValue = castToType("42", Number);
console.log(numericValue, typeof numericValue);

// Casting a string to a boolean
const booleanValue = castToType("true", (val) => val === "true");
console.log(booleanValue, typeof booleanValue);

//Ex3: Type Assertions with Generic Constraints
function getArrayLength<T extends number | string>(arr: T[]): number {
  // Use type assertion to ensure TypeScript treats the value securely
  return (arr as T[]).length;
}

// Testing with different types of arrays
const numberArray = [10, 20, 30, 40];
const stringArray = ["apple", "banana", "cherry"];

console.log(getArrayLength(numberArray));
console.log(getArrayLength(stringArray));

//Ex4: Generic Interfaces with Class Implementation
interface Storage<T> {
  add(item: T): void;
  get(index: number): T;
}

class Box<T> implements Storage<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

// Testing with strings
const stringBox = new Box<string>();
stringBox.add("TypeScript");
stringBox.add("Generics");
console.log(stringBox.get(0)); 

// Testing with numbers
const numberBox = new Box<number>();
numberBox.add(100);
numberBox.add(200);
console.log(numberBox.get(1));

//Ex5: Combining Generic Classes with Constraints
interface Item<T> {
  value: T;
}

class Queue<T extends Item<any>> {
  private collection: T[] = [];

  add(item: T): void {
    this.collection.push(item);
  }

  remove(): T | undefined {
    // Remove and return the first item from the queue
    return this.collection.shift();
  }
}

const taskQueue = new Queue<{ value: string; priority: number }>();

taskQueue.add({ value: "Write Documentation", priority: 1 });
taskQueue.add({ value: "Fix Bug #404", priority: 2 });

console.log(taskQueue.remove());
