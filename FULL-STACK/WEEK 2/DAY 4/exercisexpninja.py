{
    "items": [
        {
            "name": "Vegetable soup",
            "price": 30
        },
        {
            "name": "Hamburger",
            "price": 44.9
        },
        {
            "name": "Milkshake",
            "price": 22.5
        },
        {
            "name": "Artichoke",
            "price": 18
        },
        {
            "name": "Beef stew",
            "price": 52.5
        }
    ]
}

import json
import re

MENU_FILE_PATH = 'restaurant_menu.json'

# Common lowercase connector words allowed inside a name
CONNECTOR_WORDS = {'of', 'and', 'the', 'in', 'on', 'with', 'de', 'a', 'an', 'for'}

# A normal (non-connector) word: starts with an uppercase letter,
# followed by lowercase letters, optionally with a hyphen + more lowercase
# letters (e.g. "Valentines-day").
WORD_PATTERN = re.compile(r'^[A-Z][a-z]*(-[a-z]+)?$')
CONNECTOR_PATTERN = re.compile(r'^[a-z]+$')

# Price must be exactly two digits, a comma, then "14" (e.g. "12,14")
PRICE_PATTERN = re.compile(r'^\d{2},14$')


def ensure_valentine_list(menu, persist=False):
    if 'valentine_items' not in menu:
        menu['valentine_items'] = []
        if persist:
            with open(MENU_FILE_PATH, 'w') as f:
                json.dump(menu, f, indent=4)
    return menu


def is_valid_name(name):
    words = name.split()

    if not words:
        return False, 'Name cannot be empty.'

    # Rule: no digits allowed anywhere in the name
    if any(char.isdigit() for char in name):
        return False, 'Name cannot contain numbers.'

    # Rule: first word must start with an uppercase "V"
    if not words[0].startswith('V'):
        return False, 'The first word must begin with an uppercase "V".'

    # Rule: each word is either a valid capitalized word or a lowercase connector
    for word in words:
        if word.lower() in CONNECTOR_WORDS:
            if not CONNECTOR_PATTERN.match(word):
                return False, f'Connector word "{word}" must be entirely lowercase.'
        else:
            if not WORD_PATTERN.match(word):
                return False, f'Word "{word}" must start with an uppercase letter.'

    # Rule: at least two "e" characters (case-insensitive)
    e_count = name.lower().count('e')
    if e_count < 2:
        return False, 'Name must contain at least two "e" characters.'

    return True, 'Valid name.'


def is_valid_price(price):
    if PRICE_PATTERN.match(price):
        return True, 'Valid price.'
    return False, 'Price must match the pattern XX,14 (e.g. "12,14").'


def add_valentine_item():
    with open(MENU_FILE_PATH, 'r') as f:
        menu = json.load(f)

    menu = ensure_valentine_list(menu, persist=True)

    name = input('Enter the Valentine item name: ').strip()
    name_ok, name_message = is_valid_name(name)
    if not name_ok:
        print(f'Error: {name_message}')
        return

    price = input('Enter the price (format XX,14): ').strip()
    price_ok, price_message = is_valid_price(price)
    if not price_ok:
        print(f'Error: {price_message}')
        return

    menu['valentine_items'].append({'name': name, 'price': price})

    with open(MENU_FILE_PATH, 'w') as f:
        json.dump(menu, f, indent=4)

    print(f'"{name}" was added to the Valentine\'s menu!')


def print_heart(n=6):
    # Top: two humps, each hump grows from the center outward
    for i in range(2, n + 1, 2):
        left_margin = ' ' * (n - i)
        gap = ' ' * (2 * (n - i))
        print(left_margin + '*' * i + gap + '*' * i)

    # Bottom: inverted triangle converging to a point
    for i in range(n, 0, -1):
        print(' ' * (n - i) + '*' * (2 * i - 1))


def show_valentine_menu():
    print_heart()

    with open("exercisexpgold.txt", 'r') as f:
        menu = json.load(f)

    menu = ensure_valentine_list(menu, persist=True)
    if not menu['valentine_items']:
        print('No Valentine specials yet.')
    else:
        for item in menu['valentine_items']:
            print(f"  {item['name']} - {item['price']}")


if __name__ == '__main__':
    # Test the validation rules with a few examples
    print(is_valid_name('Vegetable Soup of Valentines-day'))   
    print(is_valid_name('vegetable Soup of Valentines-day')) 
    print(is_valid_name('Vegetable Soup 2 of Valentines-day'))
    print(is_valid_name('Valentine Meal'))        

    print(is_valid_price('12,14')) 
    print(is_valid_price('123,14')) 
    print(is_valid_price('12,15'))   

    print()
    show_valentine_menu()
    
    import json
import random

ATTRIBUTE_NAMES = [
    'Strength', 'Dexterity', 'Constitution',
    'Intelligence', 'Wisdom', 'Charisma',
]


class Character:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.attributes = self._generate_attributes()

    @staticmethod
    def _roll_ability_score():
        rolls = [random.randint(1, 6) for _ in range(4)]
        rolls.remove(min(rolls))   # discard the lowest die
        return sum(rolls)

    def _generate_attributes(self):
        return {
            attribute: self._roll_ability_score()
            for attribute in ATTRIBUTE_NAMES
        }

    def to_dict(self):
        return {
            'name': self.name,
            'age': self.age,
            'attributes': self.attributes,
        }

    def __str__(self):
        lines = [f'{self.name} (Age {self.age})']
        for attribute, score in self.attributes.items():
            lines.append(f'  {attribute}: {score}')
        return '\n'.join(lines)


class Game:
    def __init__(self):
        self.characters = []

    def create_characters(self):
        num_players = self._get_valid_player_count()

        for i in range(num_players):
            print(f'\n--- Player {i + 1}, create your character ---')
            name = input('Character name: ').strip()
            age = self._get_valid_age()
            character = Character(name, age)
            self.characters.append(character)
            print(f'{name} was created!')

    @staticmethod
    def _get_valid_player_count():
        while True:
            raw = input('How many players are playing? ')
            if raw.isdigit() and int(raw) > 0:
                return int(raw)
            print('Please enter a positive whole number.')

    @staticmethod
    def _get_valid_age():
        while True:
            raw = input('Character age: ')
            if raw.isdigit() and int(raw) > 0:
                return int(raw)
            print('Please enter a positive whole number.')

    def export_txt(self, file_path='characters.txt'):
        with open(file_path, 'w') as f:
            for character in self.characters:
                f.write(str(character))
                f.write('\n\n')
        print(f'Characters saved to {file_path}')

    def export_json(self, file_path='characters.json'):
        data = [character.to_dict() for character in self.characters]
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
        print(f'Characters saved to {file_path}')


def main():
    game = Game()
    game.create_characters()
    game.export_txt()
    game.export_json()


if __name__ == '__main__':
    main()
    
    [
    {
        "name": "Aragorn",
        "age": 87,
        "attributes": {
            "Strength": 10,
            "Dexterity": 14,
            "Constitution": 14,
            "Intelligence": 11,
            "Wisdom": 15,
            "Charisma": 11
        }
    },
    {
        "name": "Legolas",
        "age": 2931,
        "attributes": {
            "Strength": 10,
            "Dexterity": 13,
            "Constitution": 15,
            "Intelligence": 14,
            "Wisdom": 13,
            "Charisma": 10
        }
    }
]