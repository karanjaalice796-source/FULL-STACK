// Treat this exercise as its own module so its example names do not leak into
// the other Day 3 exercise files.
export {};

//Ex1: Class with Access Modifiers
class Employee {
  private name: string;
  private salary: number;
  public position: string;
  protected department: string;

  constructor(name: string, salary: number, position: string, department: string) {
    this.name = name;
    this.salary = salary;
    this.position = position;
    this.department = department;
  }

  public getEmployeeInfo(): string {
    return `Employee: ${this.name}, Position: ${this.position}`;
  }
}

const emp = new Employee("Alice", 75000, "Software Engineer", "Engineering");
console.log(emp.getEmployeeInfo());

//Ex2: Readonly Properties in a Class
class Product {
  readonly id: number;
  public name: string;
  public price: number;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  public getProductInfo(): string {
    return `Product: ${this.name}, Price: $${this.price}`;
  }
}

const product = new Product(101, "Wireless Mouse", 29.99);
console.log(product.getProductInfo());

//Ex3: Class Inheritance
class Animal {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public makeSound(): string {
    return "Some generic sound";
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  public makeSound(): string {
    return "bark";
  }
}

const myDog = new Dog("Rex");
console.log(myDog.name); 
console.log(myDog.makeSound());

//Ex4: Static Properties and Methods
class Calculator {
  public static add(a: number, b: number): number {
    return a + b;
  }

  public static subtract(a: number, b: number): number {
    return a - b;
  }
}

console.log(Calculator.add(15, 5));
console.log(Calculator.subtract(15, 5));

//Ex5: Extending Interfaces with Optional and Readonly Properties
interface User {
  readonly id: number;
  name: string;
  email: string;
}

interface PremiumUser extends User {
  membershipLevel?: string;
}

function printUserDetails(user: PremiumUser): void {
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Membership: ${user.membershipLevel ?? "None"}`);
}

const user: PremiumUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  membershipLevel: "Gold"
};

printUserDetails(user);
