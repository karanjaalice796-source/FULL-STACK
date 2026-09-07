import random

SUITS = ('Hearts', 'Diamonds', 'Clubs', 'Spades')
VALUES = ('A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K')


class Card:
    def __init__(self, suit, value):
        self.suit = suit
        self.value = value

    def __str__(self):
        return f'{self.value} of {self.suit}'

    def __repr__(self):
        return f'Card({self.suit!r}, {self.value!r})'


class Deck:
    def __init__(self):
        self.cards = []
        self.shuffle()

    def shuffle(self):
        # Rebuild a full 52-card deck, then shuffle it
        self.cards = [Card(suit, value) for suit in SUITS for value in VALUES]
        random.shuffle(self.cards)

    def deal(self):
        if not self.cards:
            return None
        return self.cards.pop()


if __name__ == '__main__':
    deck = Deck()
    print(f'Deck has {len(deck.cards)} cards after shuffle.') 

    card1 = deck.deal()
    print(f'Dealt: {card1}')
    print(f'Deck now has {len(deck.cards)} cards.') 

    card2 = deck.deal()
    print(f'Dealt: {card2}')
    print(f'Deck now has {len(deck.cards)} cards.')

    # Deal the rest of the deck to confirm it empties cleanly
    remaining = 0
    while deck.deal() is not None:
        remaining += 1
    print(f'Dealt {remaining} more cards.') 
    print(f'Deck now has {len(deck.cards)} cards.') 
    print(f'Dealing from an empty deck returns: {deck.deal()}')  # None

    # Confirm shuffle() rebuilds a full, fresh deck
    deck.shuffle()
    print(f'After reshuffling, deck has {len(deck.cards)} cards.')  # 52