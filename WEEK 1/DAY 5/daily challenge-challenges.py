#Challenge 1: Sorting
# Step 1: Get Input
user_input = input("Enter comma-separated words: ")

# Step 2: Split the String
# Splits the string at each comma into a list of words
words_list = user_input.split(",")

# Step 3: Sort the List
# Sorts the items alphabetically in-place
words_list.sort()

# Step 4: Join the Sorted List
# Joins the list elements back into a single string separated by commas
result_string = ",".join(words_list)

# Step 5: Print the Result
print(result_string)

#Challenge 2: Longest Word
# Step 1: Define the Function
def longest_word(sentence):
    # Step 2: Split the Sentence into Words (splits by whitespace)
    words = sentence.split()
    
    # Step 3: Initialize Variables
    longest = ""
    
    # Step 4: Iterate Through the Words
    for word in words:
        # Step 5: Compare Word Lengths
        # Using > (and not >=) ensures that if there's a tie, 
        # the first longest word encountered is kept.
        if len(word) > len(longest):
            longest = word
            
    # Step 6: Return the Longest Word
    return longest


# Testing the function with the expected outputs:
print(repr(longest_word("Margaret's toy is a pretty doll.")))
print(repr(longest_word("A thing of beauty is a joy forever.")))
print(repr(longest_word("Forgetfulness is by all means powerless!")))
