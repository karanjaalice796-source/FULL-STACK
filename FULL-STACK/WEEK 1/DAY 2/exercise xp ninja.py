#1. formula
import math

C = 50
H = 30

user_input = input("Enter comma-separated values for D (100,150,180): ")
d_values = user_input.split(",")

results = []
for d in d_values:
    D = float("d.strip()")
    # Formula: Q = sqrt((2 * C * D) / H)
    Q = math.sqrt((2 * C * D) / H)
    results.append(str(round(Q)))

print(",".join(results))

#2. list of integers
import random

# Base setup (Demonstrating using sample 1)
numbers = [3, 47, 99, -80, 22, 97, 54, -23, 5, 7]

# --- 2. Information Display ---
print("a. Original list:", numbers)

sorted_desc = sorted(numbers, reverse=True)
print("b. Sorted descending:", sorted_desc)

total_sum = sum(numbers)
print("c. Sum of all numbers:", total_sum)

# --- 3 to 10. Operations ---
print("3. First and last numbers:", [numbers[0], numbers[-1]])
print("4. Numbers > 50:", [x for x in numbers if x > 50])
print("5. Numbers < 10:", [x for x in numbers if x < 10])
print("6. Numbers squared:", " ".join(str(x**2) for x in numbers))

unique_numbers = list(set(numbers))
print(f"7. Without duplicates: {unique_numbers} (Count: {len(unique_numbers)})")

average = total_sum / len(numbers)
print("8. Average:", average)
print("9. Largest number:", max(numbers))
print("10. Smallest number:", min(numbers))

# --- 11. Bonus: Without built-in functions ---
calc_sum = 0
calc_largest = numbers[0]
calc_smallest = numbers[0]
count = 0

for num in numbers:
    calc_sum += num
    count += 1
    if num > calc_largest:
        calc_largest = num
    if num < calc_smallest:
        calc_smallest = num

calc_avg = calc_sum / count

print("\n--- Bonus 11: Without built-ins ---")
print(f"Sum: {calc_sum} | Avg: {calc_avg} | Max: {calc_largest} | Min: {calc_smallest}")

# --- 12. Bonus: Ask user for 10 numbers ---
# user_numbers = []
# print("\nPlease enter 10 integers between -100 and 100:")
# while len(user_numbers) < 10:
#     val = int(input(f"Enter number {len(user_numbers)+1}: "))
#     if -100 <= val <= 100:
#         user_numbers.append(val)
#     else:
#         print("Number out of bounds. Try again.")

# --- 13. Bonus: Generate 10 random integers ---
random_10 = ([random.randint(-100, 100) for _ in range(10)])
print("\n13. Generated 10 random integers:", random_10)

# --- 14 & 15. Bonus: Random list size (at least 50 items) ---
random_size = random.randint(50, 100)  # Generates count >= 50
random_dynamic = [random.randint(-100, 100) for _ in range(random_size)]
print(f"\n14. Generated {len(random_dynamic)} random integers.")

# 15. Yes, all previous code using functions like sum(), len(), min(), max(),
# loops, or list comprehensions works dynamically regardless of the list size!

#3. working on a paragraph
import re

paragraph = """Python was created by Guido van Rossum and first released in 1991. 
Its design philosophy emphasizes code readability with the use of significant indentation. 
Is Python versatile? Absolutely! It supports multiple programming paradigms."""

# Character counts
total_chars = len(paragraph)
non_whitespace_chars = len(re.sub(r'\s', '', paragraph))

# Sentences (splits by punctuation: . ! ?)
sentences = [s.strip() for s in re.split(r'[.!?]+', paragraph) if s.strip()]
sentence_count = len(sentences)

# Words (extracts clean alphabetic/numeric word tokens regardless of punctuation)
words = re.findall(r'\b\w+\b', paragraph.lower())
word_count = len(words)

# Word uniqueness
unique_words = set(words)
unique_word_count = len(unique_words)
non_unique_word_count = word_count - unique_word_count

# Average words per sentence
avg_words_per_sentence = word_count / sentence_count if sentence_count > 0 else 0

print("--- Paragraph Analysis ---")
print(f"Total characters: {total_chars}")
print(f"Non-whitespace characters (Bonus): {non_whitespace_chars}")
print(f"Sentences count: {sentence_count}")
print(f"Total words: {word_count}")
print(f"Unique words count: {unique_word_count}")
print(f"Non-unique words count (Bonus): {non_unique_word_count}")
print(f"Average words per sentence (Bonus): {avg_words_per_sentence:.2f}")

#frequence of the words
user_input = input("Enter a string: ")

# Split by spaces to preserve punctuation attached to words (as per sample output)
words = user_input.split(" ")

# Count frequencies
frequency = {}
for word in words:
    frequency[word] = frequency.get(word, 0) + 1

# Print sorted alphanumerically by word key
for word in sorted(frequency.keys()):
    print(f"{word}:{frequency[word]}")