#1. whats your name?
def get_full_name(first_name, last_name, middle_name=""):
    if middle_name:
        full_name = f"{first_name} {middle_name} {last_name}"
    else:
        full_name = f"{first_name} {last_name}"
    
    return full_name.title()

# Examples:
print(get_full_name(first_name="john", middle_name="hooker", last_name="lee"))


print(get_full_name(first_name="bruce", last_name="lee"))

#2: From English to Morse
MORSE_CODE_DICT = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ',': '--..--', '.': '.-.-.-', '?': '..--..'
}

# Invert dictionary for Morse to English lookup
ENGLISH_CODE_DICT = {v: k for k, v in MORSE_CODE_DICT.items()}

def to_morse(text):
    words = text.upper().split(' ')
    morse_words = []
    
    for word in words:
        morse_letters = [MORSE_CODE_DICT[char] for char in word if char in MORSE_CODE_DICT]
        morse_words.append(" ".join(morse_letters))
        
    return " / ".join(morse_words)

def to_english(morse_text):
    morse_words = morse_text.split(' / ')
    english_words = []
    
    for word in morse_words:
        letters = word.split(' ')
        english_letters = [ENGLISH_CODE_DICT[code] for code in letters if code in ENGLISH_CODE_DICT]
        english_words.append("".join(english_letters))
        
    return " ".join(english_words)

# Examples:
encoded = to_morse("Hello World")
print("Morse Code:", encoded)

decoded = to_english(encoded)
print("Decoded English:", decoded)

#3: Box of stars
def box_printer(*words):
    if not words:
        return
    
    # Determine the maximum length among provided words
    max_len = max(len(word) for word in words)
    
    # Top border (word width + 4 padding/border spaces)
    border = "*" * (max_len + 4)
    print(border)
    
    # Print each word aligned inside the box
    for word in words:
        print(f"* {word.ljust(max_len)} *")
        
    # Bottom border
    print(border)

# Example call:
box_printer("Hello", "World", "in", "reallylongword", "a", "frame")

#4. What is the purpose of this code?
# ==========================================
# Exercise 4: Insertion Sort
# ==========================================

def insertion_sort(alist):
    """
    Sorts a list of elements in ascending order in-place using 
    the Insertion Sort algorithm.
    """
    for index in range(1, len(alist)):
        currentvalue = alist[index]
        position = index

        # Shift elements of alist[0..index-1] that are greater 
        # than currentvalue to one position ahead of their current position
        while position > 0 and alist[position - 1] > currentvalue:
            alist[position] = alist[position - 1]
            position = position - 1

        alist[position] = currentvalue


# Example Usage & Verification:
if __name__ == "__main__":
    numbers = [54, 26, 93, 17, 77, 31, 44, 55, 20]
    print("Original List:", numbers)
    
    insertion_sort(numbers)
    
    print("Sorted List:  ", numbers)
    # Output: [17, 20, 26, 31, 44, 54, 55, 77, 93]