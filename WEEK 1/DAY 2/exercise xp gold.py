#1. Concatenate lists
list1 = [1, 2, 3]
list2 = [4, 5, 6]

# Method 1: Using extend()
combined = list1.copy()
combined.extend(list2)
print(combined)

# Method 2: Unpacking
combined_alt = [*list1, *list2]
print(combined_alt)

#2. Range of numbers
# Multiples of both 5 AND 7 (i.e., multiples of 35)
for num in range(1500, 2501):
    if num % 5 == 0 and num % 7 == 0:
        print(num)

#3. check the index
names = ['Samus', 'Cortana', 'V', 'Link', 'Mario', 'Cortana', 'Samus']
user_name = input("Enter your name: ")

if user_name in names:
    print(names.index(user_name))
else:
    print("Name not found in the list.")

#4. Greatest Number
num1 = float(input("Input the 1st number: "))
num2 = float(input("Input the 2nd number: "))
num3 = float(input("Input the 3rd number: "))

greatest = max(num1, num2, num3)

# Print as integer if it has no decimal part
if greatest.is_integer():
    greatest = int(greatest)

print(f"\nThe greatest number is: {greatest}")

#5. The Alphabet
alphabet = "abcdefghijklmnopqrstuvwxyz"
vowels = "aeiou"

for letter in alphabet:
    if letter in vowels:
        print(f"'{letter}' is a vowel.")
    else:
        print(f"'{letter}' is a consonant.")

#6. Words and letters
words = []
for i in range(1, 8):
    word = input(f"Enter word {i} of 7: ")
    words.append(word)

letter = input("\nEnter a single character to search for: ")

for word in words:
    index = word.find(letter)
    if index != -1:
        print(f"In '{word}', '{letter}' first appears at index {index}.")
    else:
        print(f"Bummer! The letter '{letter}' doesn't appear in the word '{word}'.")

#7. Min, Max, Sum
numbers = list(range(1, 1000001))

print(f"Min: {min(numbers)}")
print(f"Max: {max(numbers)}")
print(f"Sum: {sum(numbers)}")

#8. list and tuples
user_input = input("Enter comma-separated numbers: ")

numbers_list = user_input.split(",")
numbers_tuple = tuple(numbers_list)

print(numbers_list)
print(numbers_tuple)

#9. Random number (with Bonuses)
import random

wins = 0
losses = 0

print("--- Number Guessing Game ---")

while True:
    user_input = input("\nGuess a number between 1 and 9 (or type 'quit' to exit): ").strip()
    
    if user_input.lower() == 'quit':
        break
        
    if not user_input.isdigit() or not (1 <= int(user_input) <= 9):
        print("Invalid input. Please enter a number from 1 to 9.")
        continue

    user_guess = int(user_input)
    secret_number = random.randint(1, 9)
    
    if user_guess == secret_number:
        print("Winner!")
        wins += 1
    else:
        print(f"Better luck next time. The correct number was {secret_number}.")
        losses += 1

print("\n--- Final Score ---")
print(f"Games Won: {wins}")
print(f"Games Lost: {losses}")

