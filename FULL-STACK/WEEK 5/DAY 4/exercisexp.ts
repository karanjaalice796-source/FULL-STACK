// Keep this exercise separate from the other Day 4 examples.
export {};

//Ex1: Intersection Types
type Person = {
  name: string;
  age: number;
};

type Address = {
  street: string;
  city: string;
};

type PersonWithAddress = Person & Address;

const employeeProfile: PersonWithAddress = {
  name: 'Alice Smith',
  age: 30,
  street: '123 Tech Lane',
  city: 'Silicon Valley'
};

//Ex2: Type Guards with Union Types
function describeValue(value: number | string): string {
  if (typeof value === 'number') {
    return "This is a number";
  } else {
    return "This is a string";
  }
}

console.log(describeValue(42));
console.log(describeValue("Hello"));

//Ex3: Type Casting
let someValue: any = "Dynamic Content";

// Cast the any type to string and use string methods
let stringLength: number = (someValue as string).length;
let uppercaseValue: string = (someValue as string).toUpperCase();

console.log(uppercaseValue);

//Ex4: Type Assertions with Union Types
function getFirstElement(arr: (number | string)[]): string {
  // Using type assertion to treat the first element as a string
  return arr[0] as string;
}
const mixedArray = [100, "hello", 200];
const firstEl = getFirstElement(mixedArray);
console.log(firstEl.toUpperCase());

//Ex5: Generic Constraints
function logLength<T extends { length: number }>(item: T): void {
  console.log(`Length: ${item.length}`);
}

logLength("Hello TypeScript");
logLength([1, 2, 3, 4, 5]);

//Ex6: Intersection Types and Type Guards
type Job = {
  position: 'Manager' | 'Developer';
  department: string;
};

type Employee = Person & Job;

function describeEmployee(employee: Employee): string {
  if (employee.position === 'Manager') {
    return `${employee.name} (${employee.age}) manages the ${employee.department} department.`;
  } else {
    return `${employee.name} (${employee.age}) develops software in the ${employee.department} department.`;
  }
}

// Example usage:
const dev: Employee = {
  name: 'Bob',
  age: 25,
  position: 'Developer',
  department: 'Engineering'
};
console.log(describeEmployee(dev));
