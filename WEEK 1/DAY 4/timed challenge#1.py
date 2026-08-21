# Read input string and character
text = input("Enter string: ")
char = input("Enter character: ")

# Count occurrences of the character in the text
occurrences = text.count(char)

# Print the result
print(occurrences)


def count_occurrences():
    text = input("String: ")
    char = input("Character: ")
    
    count = text.count(char)
    print(f"Output: {count}")

count_occurrences()