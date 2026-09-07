# Birthday Look-up
# Exercise 1: Initializing the dictionary
birthdays = {
    "Alice": "1995/04/12",
    "Bob": "1988/11/23",
    "Charlie": "2001/01/05",
    "Diana": "1992/08/30",
    "Evan": "1999/06/15"
}

# Exercise 1: Welcome message
print("Welcome to the Birthday Look-up App!")

# Exercise 3: Ask the user to add a new birthday first
print("\n--- Add a New Entry ---")
new_name = input("Enter a person's name to add: ").strip().capitalize()
new_bday = input(f"Enter {new_name}'s birthday (YYYY/MM/DD): ").strip()
birthdays[new_name] = new_bday
print(f"Added {new_name} to the lookup list!")

# Exercise 2: Print out all available names
print("\n--- Available Names ---")
print("You can look up the birthdays of the following people:")
for name in birthdays.keys():
    print(f"- {name}")

# Exercise 1 & 2: Get user input and perform lookup with error handling
user_query = input("\nWhose birthday would you like to look up? ").strip().capitalize()

if user_query in birthdays:
    print(f"\n{user_query}'s birthday is on {birthdays[user_query]}.")
else:
    print(f"\nSorry, we don't have the birthday information for {user_query}.")

    #4: fruit shop
    # Part 1: Print items and prices in a sentence
items_simple = {
    "banana": 4,
    "apple": 2,
    "orange": 1.5,
    "pear": 3
}

print("--- Item Price List ---")
for item, price in items_simple.items():
    print(f"The price of a(n) {item} is ${price:.2f}.")

# Part 2: Calculate total value of stock
items_stock = {
    "banana": {"price": 4, "stock": 10},
    "apple": {"price": 2, "stock": 5},
    "orange": {"price": 1.5, "stock": 24},
    "pear": {"price": 3, "stock": 1}
}

total_stock_cost = 0

for item, info in items_stock.items():
    item_total = info["price"] * info["stock"]
    total_stock_cost += item_total

print(f"\nTotal cost to buy everything in stock: ${total_stock_cost:.2f}")