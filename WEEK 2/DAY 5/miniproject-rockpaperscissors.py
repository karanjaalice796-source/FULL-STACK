import random

VALID_ITEMS = ('rock', 'paper', 'scissors')

# Maps each item to the item it beats
BEATS = {
    'rock': 'scissors',
    'paper': 'rock',
    'scissors': 'paper',
}


class Game:
    def get_user_item(self):
        while True:
            choice = input('Choose rock, paper, or scissors: ').strip().lower()
            if choice in VALID_ITEMS:
                return choice
            print(f'Invalid choice. Please choose one of: {", ".join(VALID_ITEMS)}.')

    def get_computer_item(self):
        return random.choice(VALID_ITEMS)

    def get_game_result(self, user_item, computer_item):
        if user_item == computer_item:
            return 'draw'
        elif BEATS[user_item] == computer_item:
            return 'win'
        else:
            return 'loss'

    def play(self):
        user_item = self.get_user_item()
        computer_item = self.get_computer_item()
        result = self.get_game_result(user_item, computer_item)

        print(f'\nYou chose: {user_item}')
        print(f'Computer chose: {computer_item}')

        if result == 'win':
            print('You win!')
        elif result == 'loss':
            print('You lose!')
        else:
            print("It's a draw!")

        return result
    
    from game import Game

MENU_OPTIONS = {
    '1': 'play',
    '2': 'scores',
    '3': 'quit',
}


def get_user_menu_choice():
    while True:
        print('\n--- Rock Paper Scissors ---')
        print('1. Play a new game')
        print('2. Show scores')
        print('3. Quit')

        choice = input('Choose an option (1-3): ').strip()

        if choice in MENU_OPTIONS:
            return MENU_OPTIONS[choice]

        print('Invalid choice. Please enter 1, 2, or 3.')


def print_results(results):
    wins = results.get('win', 0)
    losses = results.get('loss', 0)
    draws = results.get('draw', 0)

    print(f'\nWins: {wins}, Losses: {losses}, Draws: {draws}')
    print('Thanks for playing!')


def main():
    results = {'win': 0, 'loss': 0, 'draw': 0}

    while True:
        choice = get_user_menu_choice()

        if choice == 'play':
            game = Game()
            result = game.play()
            results[result] += 1

        elif choice == 'scores':
            print_results(results)

        elif choice == 'quit':
            print_results(results)
            break


if __name__ == '__main__':
    main()