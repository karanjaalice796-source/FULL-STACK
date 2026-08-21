#
# Read input from user
REverseinp = input()

# Split sentence into words, reverse the list, and join with spaces
reversed_words = " ".join(REverseinp.split()[::-1])

# Print the result
print(reversed_words)