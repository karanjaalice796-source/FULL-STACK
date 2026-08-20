#favourite numbers
# 1. Create set of favorite numbers
my_fav_numbers = {7, 13, 21}

# 2. Add two new numbers
my_fav_numbers.add(42)
my_fav_numbers.add(99)  # Last number added

# 3. Remove the last number added
my_fav_numbers.remove(99)

# 4. Create friend's set
friend_fav_numbers = {3, 7, 14, 42, 88}

# 5. Concatenate using union (removes duplicates automatically)
our_fav_numbers = my_fav_numbers.union(friend_fav_numbers)

print("Our Favorite Numbers:", our_fav_numbers)

#Tuple Immutability
# Create a tuple
my_tuple = (10, 20, 30)

#List Manipulation
basket = ["Banana", "Apples", "Oranges", "Blueberries"]

# 1. Remove "Banana"
basket.remove("Banana")

# 2. Remove "Blueberries"
basket.remove("Blueberries")

# 3. Add "Kiwi" to the end
basket.append("Kiwi")

# 4. Add "Apples" to the beginning
basket.insert(0, "Apples")

# 5. Count how many times "Apples" appears
apples_count = basket.count("Apples")
print(f"'Apples' appears {apples_count} times.")

# 6. Empty the list
basket.clear()

# 7. Print the final state
print("Final basket state:", basket)


#floats
# Generating sequence [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] dynamically:
sequence = [x / 2 if x % 2 != 0 else x // 2 for x in range(3, 11)]

print(sequence)

#for loop
# 1. Print numbers 1 to 20 inclusive
print("Numbers 1 to 20:")
for num in range(1, 21):
    print(num, end=" ")
print("\n")

# 2. Print every number from 1 to 20 where the index (1-based position) is even
print("Numbers at even positions (2nd, 4th, 6th...):")
numbers = list(range(1, 21))
for index in range(len(numbers)):
    if (index + 1) % 2 == 0:  # Check if 1-based index is even
        print(numbers[index], end=" ")
print()

#While Loop Input Validation
while True:
    name = input("Please enter your name: ").strip()
    
    # Check if input is non-numeric AND at least 3 letters long
    if not name.isdigit() and len(name) >= 3 and name.isalpha():
        print(f"Thank you, {name}!")
        break
    else:
        print("Invalid input! Name must contain only letters and be at least 3 characters long.\n")

#while True:
    name = input("Please enter your name: ").strip()
    
    # Check if input is non-numeric AND at least 3 letters long
    if not name.isdigit() and len(name) >= 3 and name.isalpha():
        print(f"Thank you, {name}!")
        break
    else:
        print("Invalid input! Name must contain only letters and be at least 3 characters long.\n")

        #Favorite Fruits
        # Ask user for favorite fruits separated by spaces
fav_fruits_input = input("Enter your favorite fruits separated by spaces: ")
fav_fruits_list = fav_fruits_input.strip().split()

# Ask for a single chosen fruit
chosen_fruit = input("Enter the name of any fruit: ").strip()

# Check presence
if chosen_fruit in fav_fruits_list:
    print("You chose one of your favorite fruits! Enjoy!")
else:
    print("You chose a new fruit. I hope you enjoy it!")

#Pizza Toppings
toppings = []
base_price = 10.00
topping_price = 2.50

while True:
    topping = input("Enter a pizza topping (or 'quit' to finish): ").strip()
    
    if topping.lower() == 'quit':
        break
    
    toppings.append(topping)
    print(f"Adding {topping} to your pizza.")

total_cost = base_price + (len(toppings) * topping_price)

print("\n--- Summary ---")
print(f"Toppings selected: {', '.join(toppings) if toppings else 'None'}")
print(f"Total cost: ${total_cost:.2f}")

#Cinemax Tickets & Bonus
# Main Ticket Calculator
family_ages = input("Enter the age of each family member separated by spaces: ").split()

total_cost = 0
for age_str in family_ages:
    age = int(age_str)
    if age < 3:
        total_cost += 0
    elif 3 <= age <= 12:
        total_cost += 10
    else:
        total_cost += 15

print(f"Total ticket cost: ${total_cost}\n")

# --- Bonus: Movie Restriction (Ages 16-21) ---
print("--- Restricted Movie Screening (Ages 16-21) ---")
group_ages = input("Enter ages of teenage group separated by spaces: ").split()

# Filter attendees aged between 16 and 21 inclusive
allowed_attendees = [int(age) for age in group_ages if 16 <= int(age) <= 21]

print("Final list of allowed attendee ages:", allowed_attendees)