class AnagramChecker:
    def __init__(self, file_path='anagramcheckerproject.txt'):
        with open(file_path, 'r') as f:
            content = f.read()

        # Store as a lowercase set for fast, case-insensitive lookups
        self.word_list = {word.lower() for word in content.split()}

    def is_valid_word(self, word):
        return word.lower() in self.word_list

    def is_anagram(self, word1, word2):
        return sorted(word1.lower()) == sorted(word2.lower())

    def get_anagrams(self, word):
        anagrams = []
        for candidate in self.word_list:
            if self.is_anagram(candidate, word) and candidate.lower() != word.lower():
                anagrams.append(candidate)
        return anagrams
    
from anagramchecker import AnagramChecker


def show_menu():
    print('\n--- Anagram Checker ---')
    print('1. Check a word')
    print('2. Exit')


def get_valid_word():
    raw_input_value = input('Enter a word: ').strip()

    words = raw_input_value.split()
    if len(words) != 1:
        print('Error: please enter exactly one word.')
        return None

    word = words[0]
    if not word.isalpha():
        print('Error: only alphabetic characters are allowed.')
        return None

    return word


def display_word_info(checker, word):
    is_valid = checker.is_valid_word(word)
    anagrams = checker.get_anagrams(word)

    print(f'\nYOUR WORD: "{word.upper()}"')

    if is_valid:
        print('This is a valid English word.')
    else:
        print('This is not a recognized English word.')

    if anagrams:
        print(f"Anagrams for your word: {', '.join(anagrams)}.")
    else:
        print('No anagrams were found for your word.')


def main():
    checker = AnagramChecker()

    while True:
        show_menu()
        choice = input('Choose an option (1-2): ').strip()

        if choice == '1':
            word = get_valid_word()
            if word is not None:
                display_word_info(checker, word)
        elif choice == '2':
            print('Goodbye!')
            break
        else:
            print('Invalid choice, please try again.')


if __name__ == '__main__':
    main()