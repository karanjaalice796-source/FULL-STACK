#exercise 1.
class Currency:
    def __init__(self, currency, amount):
        self.currency = currency
        self.amount = amount

    def __str__(self):
        return f'{self.amount} {self.currency}s'

    def __repr__(self):
        return f'{self.amount} {self.currency}s'

    def __int__(self):
        return self.amount

    def __add__(self, other):
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f'Cannot add between Currency type <{self.currency}> and <{other.currency}>'
                )
            return self.amount + other.amount
        elif isinstance(other, (int, float)):
            return self.amount + other
        else:
            raise TypeError(f'Cannot add Currency and {type(other)}')

    def __iadd__(self, other):
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f'Cannot add between Currency type <{self.currency}> and <{other.currency}>'
                )
            self.amount += other.amount
        elif isinstance(other, (int, float)):
            self.amount += other
        else:
            raise TypeError(f'Cannot add Currency and {type(other)}')
        return self


if __name__ == '__main__':
    c1 = Currency('dollar', 5)
    c2 = Currency('dollar', 10)
    c3 = Currency('shekel', 1)
    c4 = Currency('shekel', 10)

    print(c1)    
    print(int(c1))  
    print(repr(c1))  
    print(c1 + 5)  
    print(c1 + c2)  
    print(c1)   

    c1 += 5
    print(c1)   

    c1 += c2
    print(c1)  

def sum_two_numbers(a, b):
    result = a + b
    print(f"the sum is:{result}")
    return(result)

import func
func.sum_two_numbers(3, 7)

from func import sum_two_numbers
sum_two_numbers(4, 5)  
import string
import random


def generate_random_string(length=5):
    letters = string.ascii_letters  # uppercase + lowercase letters
    result = ''
    for _ in range(length):
        result += random.choice(letters)
    return result


if __name__ == '__main__':
    print(generate_random_string())

    import datetime


def display_current_date():
    today = datetime.date.today()
    print(f'Today\'s date is: {today}')
    return today


if __name__ == '__main__':
    display_current_date()

    import datetime


def time_until_new_year():
    now = datetime.datetime.now()
    next_jan_first = datetime.datetime(year=now.year + 1, month=1, day=1)
    time_left = next_jan_first - now

    days = time_left.days
    hours, remainder = divmod(time_left.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    print(f'Time left until January 1st: {days} days, {hours} hours, '
          f'{minutes} minutes, {seconds} seconds')
    return time_left


if __name__ == '__main__':
    time_until_new_year()

    # pip install faker --break-system-packages

from faker import Faker

fake = Faker()
users = []


def add_users(number_of_users):
    for _ in range(number_of_users):
        user = {
            'name': fake.name(),
            'address': fake.address(),
            'language_code': fake.language_code(),
        }
        users.append(user)


if __name__ == '__main__':
    add_users(5)
    for u in users:
        print(u)