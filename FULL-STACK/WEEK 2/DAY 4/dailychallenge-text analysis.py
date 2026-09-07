import re
import string


class Text:
    def __init__(self, text):
        self.text = text

    def word_frequency(self, word):
        words = self.text.split()
        count = words.count(word)
        return count if count > 0 else None

    def most_common_word(self):
        words = self.text.split()
        if not words:
            return None

        frequencies = {}
        for word in words:
            frequencies[word] = frequencies.get(word, 0) + 1

        most_common = max(frequencies, key=frequencies.get)
        return most_common

    def unique_words(self):
        words = self.text.split()
        return list(set(words))

    @classmethod
    def from_file(cls, file_path):
        with open(file_path, 'r') as f:
            content = f.read()
        return cls(content)

    def __repr__(self):
        preview = self.text[:40] + ('...' if len(self.text) > 40 else '')
        return f'{self.__class__.__name__}({preview!r})'


# A small, standard set of common English stop words.
STOP_WORDS = {
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'is', 'are', 'was',
    'were', 'be', 'been', 'being', 'to', 'of', 'in', 'on', 'at', 'by', 'for',
    'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off',
    'over', 'under', 'again', 'further', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'don',
    'should', 'now', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
    'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
    'it', 'its', 'they', 'them', 'their', 'this', 'that', 'these', 'those',
    'am', 'as', 'do', 'does', 'did', 'have', 'has', 'had', 'having',
}


class TextModification(Text):
    def remove_punctuation(self):
        translator = str.maketrans('', '', string.punctuation)
        self.text = self.text.translate(translator)
        return self.text

    def remove_stop_words(self):
        words = self.text.split()
        filtered_words = [w for w in words if w.lower() not in STOP_WORDS]
        self.text = ' '.join(filtered_words)
        return self.text

    def remove_special_characters(self):
        # Keep letters, numbers, and whitespace only.
        self.text = re.sub(r'[^A-Za-z0-9\s]', '', self.text)
        return self.text


if __name__ == '__main__':
    sample = "the quick brown fox jumps over the lazy dog the fox runs fast"
    t = Text(sample)

    print(t.word_frequency('fox'))          # 2
    print(t.word_frequency('cat'))          # None
    print(t.most_common_word())             # the
    print(sorted(t.unique_words()))         # sorted for readable, deterministic output

    print('--- TextModification ---')
    dirty_text = "Hello!! This is a test... with #special@ characters, and the stop words."
    tm = TextModification(dirty_text)

    print(tm.remove_punctuation())
    print(tm.remove_stop_words())

    tm2 = TextModification("C0ol_text!! With $ymbols & numb3rs 123.")
    print(tm2.remove_special_characters())