//Library System Implementation
// 1. Define the Book interface
interface Book {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre?: string; // Optional property
}

// 2. Create the base Library class
class Library {
  // Private property to store books securely inside the class
  private books: Book[] = [];

  // Public method to add a book
  public addBook(book: Book): void {
    this.books.push(book);
    console.log(`Added: "${book.title}" by ${book.author}`);
  }

  // Public method to find a book by its ISBN
  public getBookDetails(isbn: string): Book | undefined {
    return this.books.find((book) => book.isbn === isbn);
  }

  // Protected helper method: allows subclasses to access the private books array safely
  protected getAllBooks(): Book[] {
    return this.books;
  }
}

// 3. Create the DigitalLibrary subclass extending Library
class DigitalLibrary extends Library {
  public readonly website: string;

  constructor(website: string) {
    super(); // Calls the parent constructor
    this.website = website;
  }

  // Public method to list all book titles
  public listBooks(): string[] {
    return this.getAllBooks().map((book) => book.title);
  }
}

// Create an instance of DigitalLibrary
const myLibrary = new DigitalLibrary("https://www.digital-reads-hub.io");
console.log(`Library Website: ${myLibrary.website}\n`);

// Add books to the library
myLibrary.addBook({
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt and David Thomas",
  isbn: "978-0201616224",
  publishedYear: 1999,
  genre: "Software Development",
});

myLibrary.addBook({
  title: "Clean Code",
  author: "Robert C. Martin",
  isbn: "978-0132350884",
  publishedYear: 2008,
});

console.log("\n--- Listing All Book Titles ---");
console.log(myLibrary.listBooks()); 
console.log("\n--- Fetching Specific Book Details ---");
const targetIsbn = "978-0201616224";
const details = myLibrary.getBookDetails(targetIsbn);
console.log(details); 