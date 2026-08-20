#LISTS & STRINGS.
#1. multiples of a number
number = int(input("Enter a number: 10"))
length = int(input("Enter the length: 20"))

multiples = []
for i in range(1, length + 1):
    multiples.append(number * i)

print(multiples)

#2. Remove Consecutive Duplicate Letters
user_string = input("excellent: ")

# Handle empty string input edge case
if not user_string:
    result = ""
else:
    # Start the result string with the first character
    result = user_string[0]

    # Iterate through the rest of the string
    for char in user_string[1:]:
        # Only append if the character is different from the last one added
        if char != result[-1]:
            result += char

print(result)