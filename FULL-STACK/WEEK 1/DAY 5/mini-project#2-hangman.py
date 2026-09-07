import random

wordslist = ['correction', 'childish', 'beach', 'python', 'assertive', 'interference', 'complete', 'share', 'credit card', 'rush', 'south']
word = random.choice(wordslist) 

### YOUR CODE STARTS FROM HERE ###

# Body parts added in order of incorrect guesses
HANGMAN_PICS = [
    """
       +---+
       |   |
           |
           |
           |
           |
    =========
    """,
    """
       +---+
       |   |
       O   |  (head)
           |
           |
           |
    =========
    """,
    """
       +---+
       |   |
       O   |  (head)
       |   |  (body)
           |
           |
    =========
    """,
    """
       +---+
       |   |
       O   |  (head)
      /|   |  (left arm)
           |
           |
    =========
    """,
    """
       +---+
       |   |
       O   |  (head)
      /|\\  |  (left arm, right arm)
           |
           |
    =========
    """,
    """
       +---+
       |   |
       O   |  (head)
      /|\\  |  (left arm, right arm)
      /    |  (left leg)
           |
    =========
    """,
    """
       +---+
       |   |
       O   |  (head)
      /|\\  |  (left arm, right arm)
      / \\  |  (left leg, right leg)
           |
    =========
    """
]

# Track guessed letters
guessed_letters = set()
incorrect_guesses = 0
max_attempts = 6

# Replace letters with stars, keeping spaces for multi-word phrases (like 'credit card')
display_word = [char if char == ' ' else '*' for char in word]

print("Welcome to Hangman!")

# Main Game Loop
while incorrect_guesses < max_attempts and '*' in display_word:
    print(HANGMAN_PICS[incorrect_guesses])
    print("Word:", " ".join(display_word))
    print(f"Guessed letters: {', '.join(sorted(guessed_letters)) if guessed_letters else 'None'}")
    
    guess = input("Guess a letter: ").lower().strip()
    
    # Input validation
    if len(guess) != 1 or not guess.isalpha():
        print("Please enter a single valid letter.\n")
        continue
    
    if guess in guessed_letters:
        print(f"You already guessed '{guess}'. Try a different letter.\n")
        continue
    
    # Add guess to history
    guessed_letters.add(guess)
    
    # Check if guess is in the secret word
    if guess in word:
        print(f"Great guess! '{guess}' is in the word.\n")
        for index, letter in enumerate(word):
            if letter == guess:
                display_word[index] = guess
    else:
        incorrect_guesses += 1
        print(f"Sorry, '{guess}' is not in the word.\n")

# Game Over Conditions
print(HANGMAN_PICS[incorrect_guesses])

if '*' not in display_word:
    print(f"Congratulations! You solved the phrase: {''.join(display_word)}")
else:
    print(f"Game Over! You ran out of guesses. The word was: '{word}'")