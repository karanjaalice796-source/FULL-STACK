//Ex1: Class Inheritance with Protected Access Modifiers
export
class Employee {
  protected name: string;
  protected salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  public getDetails(): string {
    return `Name: ${this.name}, Salary: $${this.salary}`;
  }
}

class Manager extends Employee {
  public department: string;

  constructor(name: string, salary: number, department: string) {
    super(name, salary); // Calls the parent class constructor
    this.department = department;
  }

  // Overriding getDetails to add department info
  public getDetails(): string {
    return `${super.getDetails()}, Department: ${this.department}`;
  }
}

// Example usage:
const manager = new Manager("Alice Smith", 95000, "Engineering");
console.log(manager.getDetails()); 

//Ex2: Using Readonly with Access Modifiers
class Car {
  public readonly make: string;
  private readonly model: string;
  public year: number;

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  public getCarDetails(): string {
    return `Make: ${this.make}, Model: ${this.model}, Year: ${this.year}`;
  }
}

// Example usage:
const myCar = new Car("Toyota", "Camry", 2023);
console.log(myCar.getCarDetails()); 

//Ex 3: Static Properties and Methods in Classes
class MathUtils {
  public static PI: number = 3.14159;

  public static circumference(radius: number): number {
    return 2 * MathUtils.PI * radius;
  }
}

// Calling static members directly on the class without an instance:
console.log(`PI value: ${MathUtils.PI}`); 

console.log(`Circumference: ${MathUtils.circumference(10)}`); 

//Ex4: Interface with Function Types
interface Operation {
  execute(a: number, b: number): number;
}

class Addition implements Operation {
  public execute(a: number, b: number): number {
    return a + b;
  }
}

class Multiplication implements Operation {
  public execute(a: number, b: number): number {
    return a * b;
  }
}

const addOp = new Addition();
console.log(`Addition Result: ${addOp.execute(10, 5)}`); 


const multOp = new Multiplication();
console.log(`Multiplication Result: ${multOp.execute(10, 5)}`); 

//Exercise 5: Extending Interfaces with Optional and Readonly Properties
interface Shape {
  color: string;
  getArea(): number;
}

interface Rectangle extends Shape {
  readonly width: number;
  readonly height: number;
  getPerimeter(): number;
}

class MyRectangle implements Rectangle {
  public color: string;
  public readonly width: number;
  public readonly height: number;

  constructor(color: string, width: number, height: number) {
    this.color = color;
    this.width = width;
    this.height = height;
  }

  public getArea(): number {
    return this.width * this.height;
  }

  public getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const rect = new MyRectangle("Crimson", 8, 4);
console.log(`Color: ${rect.color}`);
console.log(`Area: ${rect.getArea()}`); 
console.log(`Perimeter: ${rect.getPerimeter()}`); 
