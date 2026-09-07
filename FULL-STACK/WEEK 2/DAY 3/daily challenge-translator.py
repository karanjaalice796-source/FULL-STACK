"""
pip install googletrans==4.0.0-rc1
"""
from googletrans import Translator

french_words = ["Bonjour", "Au revoir", "Bienvenue", "A bientôt"]


def translate_words(words, src='fr', dest='en'):
    translator = Translator()
    translations = {}

    for word in words:
        result = translator.translate(word, src=src, dest=dest)
        translations[word] = result.text

    return translations


if __name__ == '__main__':
    translations = translate_words(french_words)
    print(translations)
