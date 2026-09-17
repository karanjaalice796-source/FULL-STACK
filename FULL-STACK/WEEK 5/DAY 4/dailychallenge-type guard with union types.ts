// Keep this challenge separate from the other Day 4 examples.
export {};

//1. Type Definitions
type User = {
  type: 'user';
  name: string;
  age: number;
};

type Product = {
  type: 'product';
  id: number;
  price: number;
};

type Order = {
  type: 'order';
  orderId: string;
  amount: number;
};

type AppData = User | Product | Order;

//2. Implementing
function handleData(items: AppData[]): string[] {
  return items.map((item) => {
    switch (item.type) {
      case 'user':
        return `Hello, ${item.name}! You are ${item.age} years old.`;
      
      case 'product':
        return `Product #${item.id} is priced at $${item.price.toFixed(2)}.`;
      
      case 'order':
        return `Order Summary -> ID: ${item.orderId}, Total Amount: $${item.amount.toFixed(2)}`;
      
      default:
        // Graceful fallback for unexpected structures or runtime anomalies
        const _exhaustiveCheck: never = item;
        return `Warning: Unrecognized data type encountered.`;
    }
  });
}

//3. Example Usage
const mixedData: AppData[] = [
  { type: 'user', name: 'Alice', age: 30 },
  { type: 'product', id: 101, price: 49.99 },
  { type: 'order', orderId: 'ORD-9876', amount: 150.50 },
];

const results = handleData(mixedData);
results.forEach((msg) => console.log(msg));
