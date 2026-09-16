//Ex1: Advanced Access Modifiers and Inheritance

class Employee {
  public name: string;
  private age: number;
  protected salary: number;

  constructor(name: string, age: number, salary: number) {
    this.name = name;
    this.age = age;
    this.salary = salary;
  }

  // protected: can be called from Employee and any subclass, but not from outside
  protected calculateBonus(): number {
    return this.salary * 0.15;
  }

  public getSalaryDetails(): string {
    return `Name: ${this.name}, Salary: $${this.salary}`;
  }
}

// Manager extends Employee and overrides getSalaryDetails(),
// reusing the protected calculateBonus() method from the parent class
class Manager extends Employee {
  public getSalaryDetails(): string {
    const bonus = this.calculateBonus(); // Accessing protected method from base class
    return `Manager: ${this.name}, Salary: $${this.salary}, Bonus: $${bonus}`;
  }
}

// Third level of inheritance: ExecutiveManager extends Manager (which extends Employee)
class ExecutiveManager extends Manager {
  public approveBudget(amount: number): void {
    console.log(`Executive ${this.name} has approved a budget of $${amount}.`);
  }
}

const exec = new ExecutiveManager("Alice Vance", 42, 140000);
console.log(exec.getSalaryDetails());
exec.approveBudget(75000);


//Ex2: Advanced Static Methods and Properties

class Shape {
  public static totalShapes: number = 0;

  constructor() {
    Shape.totalShapes++; // Tracks total created instances across all shape types
  }

  public static getType(): string {
    return "Generic Shape";
  }

  public getArea(): number {
    return 0;
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(radius: number) {
    super(); // increments Shape.totalShapes
    this.radius = radius;
  }

  public static getType(): string {
    return "Circle";
  }

  public getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Square extends Shape {
  private side: number;

  constructor(side: number) {
    super(); // increments Shape.totalShapes
    this.side = side;
  }

  public static getType(): string {
    return "Square";
  }

  public getArea(): number {
    return this.side * this.side;
  }
}

console.log(`Initial total shapes: ${Shape.totalShapes}`);

const circle = new Circle(5);
const square = new Square(4);

// Static methods are called on the class itself, not an instance
console.log(`Shape Type: ${Circle.getType()}, Area: ${circle.getArea().toFixed(2)}`);
console.log(`Shape Type: ${Square.getType()}, Area: ${square.getArea()}`);
console.log(`Total shapes created: ${Shape.totalShapes}`);


/**
 * Ex3: Complex Interfaces with Function Types
 * - Calculator requires an operate() method that accepts a callback function
 * - Behavior is injected at call-time via different arrow functions
 */
interface Calculator {
  a: number;
  b: number;
  operate(fn: (x: number, y: number) => number): number;
}

class AdvancedCalculator implements Calculator {
  public a: number;
  public b: number;

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  public operate(fn: (x: number, y: number) => number): number {
    return fn(this.a, this.b);
  }

  public add(): number {
    return this.operate((x, y) => x + y);
  }

  public subtract(): number {
    return this.operate((x, y) => x - y);
  }

  public multiply(): number {
    return this.operate((x, y) => x * y);
  }
}

const calc = new AdvancedCalculator(12, 4);
console.log(`Addition: ${calc.add()}`);             // Output: Addition: 16
console.log(`Subtraction: ${calc.subtract()}`);      // Output: Subtraction: 8
console.log(`Multiplication: ${calc.multiply()}`);   // Output: Multiplication: 48

// Passing a custom inline function into operate():
const powerResult = calc.operate((x, y) => Math.pow(x, y));
console.log(`Custom Power Operation (12^4): ${powerResult}`);


/**
 * Ex4: Readonly Properties in Complex Inheritance
 * - readonly: can be set once (in the constructor) and never reassigned afterward
 * - super.getDeviceInfo() extends rather than replaces the parent's output
 */
class Device {
  public readonly serialNumber: string;

  constructor(serialNumber: string) {
    this.serialNumber = serialNumber;
  }

  public getDeviceInfo(): string {
    return `Serial Number: ${this.serialNumber}`;
  }
}

class Laptop extends Device {
  public model: string;
  public price: number;

  constructor(serialNumber: string, model: string, price: number) {
    super(serialNumber);
    this.model = model;
    this.price = price;
  }

  public getDeviceInfo(): string {
    return `${super.getDeviceInfo()}, Model: ${this.model}, Price: $${this.price}`;
  }
}

const myLaptop = new Laptop("SN-987654321", "ThinkPad X1", 1499);
console.log(myLaptop.getDeviceInfo());

// Mutable properties can be updated (unlike serialNumber, which is readonly):
myLaptop.price = 1299;
console.log(`Updated Price: $${myLaptop.price}`);


/**
 * Ex5: Extending Multiple Interfaces with Optional and Readonly Properties
 * - Electronics extends Product: interface inheritance
 * - discount?: number is optional — implementing classes don't have to supply it
 */
interface Product {
  readonly name: string;
  price: number;
  discount?: number;
}

interface Electronics extends Product {
  warrantyPeriod: number; // in months
}

class Smartphone implements Electronics {
  public readonly name: string;
  public price: number;
  public discount?: number;
  public warrantyPeriod: number;

  constructor(name: string, price: number, warrantyPeriod: number, discount?: number) {
    this.name = name;
    this.price = price;
    this.warrantyPeriod = warrantyPeriod;
    if (discount !== undefined) {
      this.discount = discount;
    }
  }

  public getFinalPrice(): number {
    if (this.discount !== undefined) {
      return this.price - (this.price * (this.discount / 100));
    }
    return this.price;
  }
}

const phoneWithDiscount = new Smartphone("Pixel 8 Pro", 999, 12, 15);
console.log(`Device: ${phoneWithDiscount.name}`);
console.log(`Warranty: ${phoneWithDiscount.warrantyPeriod} months`);
console.log(`Final Price (15% off): $${phoneWithDiscount.getFinalPrice().toFixed(2)}`);

// discount omitted here — Product's optional property is legally left out
const phoneWithoutDiscount = new Smartphone("Budget Phone", 299, 6);
console.log(`Device: ${phoneWithoutDiscount.name}`);
console.log(`Final Price: $${phoneWithoutDiscount.getFinalPrice()}`);