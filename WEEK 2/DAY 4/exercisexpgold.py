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

MENU_FILE_PATH = 'restaurant_menu.json'


class MenuManager:
    def __init__(self, file_path=MENU_FILE_PATH):
        self.file_path = file_path
        with open("exercisexpgold.txt", 'r') as f:
            self.menu = json.load(f)

    def add_item(self, name, price):
        self.menu['items'].append({'name': name, 'price': price})

    def remove_item(self, name):
        for index, item in enumerate(self.menu['items']):
            if item['name'] == name:
                del self.menu['items'][index]
                return True
        return False

    def save_to_file(self):
        with open(self.file_path, 'w') as f:
            json.dump(self.menu, f, indent=4)
            
            from menu_manager import MenuManager


def load_manager():
    return MenuManager()


def show_restaurant_menu(manager):
    print('\n--- Restaurant Menu ---')
    for item in manager.menu['items']:
        print(f"  {item['name']} - ${item['price']}")
    print()


def add_item_to_menu(manager):
    name = input('Enter the item name: ')
    price_input = input('Enter the item price: ')

    try:
        price = float(price_input)
    except ValueError:
        print('Error: price must be a number.')
        return

    manager.add_item(name, price)
    print('Item was added successfully.')


def remove_item_from_menu(manager):
    name = input('Enter the name of the item to remove: ')
    removed = manager.remove_item(name)

    if removed:
        print(f'"{name}" was removed successfully.')
    else:
        print(f'Error: "{name}" was not found in the menu.')


def show_user_menu(manager):
    while True:
        print('--- Exercise Menu Manager ---')
        print('1. Show restaurant menu')
        print('2. Add item')
        print('3. Remove item')
        print('4. Exit')

        choice = input('Choose an option (1-4): ')

        if choice == '1':
            show_restaurant_menu(manager)
        elif choice == '2':
            add_item_to_menu(manager)
        elif choice == '3':
            remove_item_from_menu(manager)
        elif choice == '4':
            manager.save_to_file()
            print('Menu was saved. Goodbye!')
            break
        else:
            print('Invalid choice, please try again.\n')


def main():
    manager = load_manager()
    show_user_menu(manager)


if __name__ == '__main__':
    main()
    
    import requests

API_KEY = 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My'


def get_gifs(query='hilarious', rating='g', limit=10):
    url = (
        f'https://api.giphy.com/v1/gifs/search'
        f'?q={query}&rating={rating}&api_key={API_KEY}&limit={limit}'
    )

    response = requests.get(url)

    if response.status_code != 200:
        print(f'Error: request failed with status code {response.status_code}')
        return []

    data = response.json()
    gifs = data['data']

    # Only keep gifs taller than 100px (using the "original" rendition's height)
    tall_gifs = [
        gif for gif in gifs
        if int(gif['images']['original']['height']) > 100
    ]

    print(f'Number of gifs taller than 100px: {len(tall_gifs)}')

    # Only return the first 10
    return tall_gifs[:10]


if __name__ == '__main__':
    gifs = get_gifs('hilarious', 'g')
    for gif in gifs:
        print(gif['title'], '-', gif['url'])
        
        import requests

API_KEY = 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My'


def search_gifs(query, rating='g', limit=10):
    url = (
        f'https://api.giphy.com/v1/gifs/search'
        f'?q={query}&rating={rating}&api_key={API_KEY}&limit={limit}'
    )
    response = requests.get(url)

    if response.status_code != 200:
        return []

    data = response.json()
    return data['data']


def get_trending_gifs(rating='g', limit=10):
    url = (
        f'https://api.giphy.com/v1/gifs/trending'
        f'?rating={rating}&api_key={API_KEY}&limit={limit}'
    )
    response = requests.get(url)

    if response.status_code != 200:
        return []

    data = response.json()
    return data['data']


def print_gifs(gifs):
    if not gifs:
        print('No gifs to display.')
        return

    for gif in gifs:
        print(f"{gif['title']} - {gif['url']}")


def main():
    query = input('Enter a term or phrase to search gifs for: ').strip()

    gifs = search_gifs(query) if query else []

    if not gifs:
        print(f'Could not find any gifs for "{query}". Here are today\'s trending gifs instead:')
        gifs = get_trending_gifs()

    print_gifs(gifs)


if __name__ == '__main__':
    main()