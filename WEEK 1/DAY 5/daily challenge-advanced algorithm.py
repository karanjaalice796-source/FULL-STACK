#Solution 1: Efficient Approach using a Set (Fast)
import random

list_of_numbers = [random.randint(0, 10000) for _ in range(20000)]
target_number = 3728


seen_numbers = set()
found_pairs = set()

for number in list_of_numbers:
    complement = target_number - number
    
    # Check if the needed complement has already been seen
    if complement in seen_numbers:
        # Sort pair so (A, B) and (B, A) are treated as duplicate pairs
        pair = tuple(sorted((number, complement)))
        found_pairs.add(pair)
        
    seen_numbers.add(number)

# Print results
print(f"Found {len(found_pairs)} unique pair(s) that sum to {target_number}:\n")
for num1, num2 in found_pairs:
    print(f"{num1} and {num2} sum to the target_number {target_number}")

    #Solution 2: Two Loops Approach (Using Loops & Conditionals)
import random

list_of_numbers = [random.randint(0, 10000) for _ in range(20000)]
target_number = 3728


found_pairs = []

# Loop through list indices
for i in range(len(list_of_numbers)):
    # Start inner loop at i + 1 to avoid pairing an element with itself
    for j in range(i + 1, len(list_of_numbers)):
        num1 = list_of_numbers[i]
        num2 = list_of_numbers[j]
        
        # Check condition
        if num1 + num2 == target_number:
            pair = tuple(sorted((num1, num2)))
            if pair not in found_pairs:
                found_pairs.append(pair)

# Print results
print(f"Found {len(found_pairs)} unique pair(s) that sum to {target_number}:\n")
for num1, num2 in found_pairs:
    print(f"{num1} and {num2} sum to the target_number {target_number}")