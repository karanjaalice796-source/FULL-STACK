// Keep this exercise separate from the other Day 4 examples.
export {};

//Ex1: TypeScript Generics and Intersection Types
// Define baseline types that can be intersected
interface Identifiable {
  id: string;
}

interface Timestamped {
  createdAt: Date;
}

// Generic Container class working with any type T
class Container<T> {
  private items: T[] = [];

  // Add an item to the container
  add(item: T): void {
    this.items.push(item);
  }

  // Remove an item based on a matching condition or predicate
  remove(predicate: (item: T) => boolean): void {
    this.items = this.items.filter((item) => !predicate(item));
  }

  // List all items in the container
  list(): T[] {
    return this.items;
  }
}

// Example usage with an intersection type (User & Identifiable & Timestamped)
type User = { name: string; email: string };
type EnhancedUser = User & Identifiable & Timestamped;

const userContainer = new Container<EnhancedUser>();

userContainer.add({
  id: "USR-001",
  name: "Alice Johnson",
  email: "alice@example.com",
  createdAt: new Date(),
});

console.log(userContainer.list());

//Ex2: Generic Interfaces and Type Casting
// Generic API Response interface
interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: unknown; // Raw or untyped data payload
}

// Generic function to parse and cast response data
function parseResponse<T>(response: ApiResponse<unknown>): T {
  // Use type casting to map the unknown data property to target type T
  return response.data as T;
}

// Example usage:
interface UserProfile {
  username: string;
  score: number;
}

const rawApiResponse: ApiResponse<unknown> = {
  status: 200,
  success: true,
  data: { username: "CodeMaster", score: 950 },
};

const userProfile = parseResponse<UserProfile>(rawApiResponse);
console.log(`User: ${userProfile.username}, Score: ${userProfile.score}`);

//Ex3: Generic Classes and Type Assertions
class Repository<T> {
  private storage: T[] = [];

  // Add an item to the repository
  add(item: T): void {
    this.storage.push(item);
  }

  // Retrieve an item by index using type assertions
  getItem(index: number): T {
    const item = this.storage[index];
    if (item === undefined) {
      throw new Error("Item not found at the specified index.");
    }
    // Explicit type assertion to guarantee type return safety
    return item as T;
  }

  // List all items
  listAll(): T[] {
    return this.storage as T[];
  }
}

// Example usage with a Product model:
interface Product {
  sku: string;
  title: string;
  price: number;
}

const productRepo = new Repository<Product>();

productRepo.add({ sku: "SKU-99", title: "Mechanical Keyboard", price: 129.99 });
productRepo.add({ sku: "SKU-100", title: "Ergonomic Mouse", price: 59.99 });

const retrievedProduct = productRepo.getItem(0);
console.log(`Retrieved: ${retrievedProduct.title} for $${retrievedProduct.price}`);
