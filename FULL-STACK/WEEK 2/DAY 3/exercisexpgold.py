"""
Requires the third-party 'holidays' module:
    pip install holidays --break-system-packages
"""
import datetime
import holidays


def display_today_and_next_holiday(country='US'):
    today = datetime.date.today()
    print(f"Today's date is: {today}")

    country_holidays = holidays.country_holidays(country)

    # Look ahead day by day until we hit the next holiday
    # (cheap and simple; works fine for a "next holiday" lookup)
    check_date = today
    for _ in range(366):
        check_date += datetime.timedelta(days=1)
        if check_date in country_holidays:
            holiday_name = country_holidays[check_date]
            days_left = (check_date - today).days
            print(f"The next holiday is {holiday_name} in {days_left} days "
                  f"(on {check_date}).")
            return holiday_name, days_left

    print("No holiday found in the next year.")
    return None, None


if __name__ == '__main__':
    display_today_and_next_holiday();EARTH_YEAR_SECONDS = 31557600

ORBITAL_PERIODS_IN_EARTH_YEARS = {
    'Mercury': 0.2408467,
    'Venus': 0.61519726,
    'Earth': 1.0,
    'Mars': 1.8808158,
    'Jupiter': 11.862615,
    'Saturn': 29.447498,
    'Uranus': 84.016846,
    'Neptune': 164.79132,
}


def age_on_planets(age_in_seconds):
    earth_years = age_in_seconds / EARTH_YEAR_SECONDS
    ages = {}
    for planet, orbital_period in ORBITAL_PERIODS_IN_EARTH_YEARS.items():
        planet_years = earth_years / orbital_period
        ages[planet] = round(planet_years, 2)
        print(f'You are {ages[planet]} {planet}-years old.')
    return ages


if __name__ == '__main__':
    age_on_planets(1_000_000_000)

import re


def return_numbers(text):
    digits = re.findall(r'\d', text)
    return ''.join(digits)


if __name__ == '__main__':
    print(return_numbers('k5k3q2g5z6x9bn'))  

import re


def is_valid_full_name(name):
    """
    Valid means:
    - only letters and exactly one space (two words)
    - first letter of each word is upper-cased, rest lower-cased
    """
    pattern = r'^[A-Z][a-zA-Z]* [A-Z][a-zA-Z]*$'
    return bool(re.match(pattern, name))


if __name__ == '__main__':
    full_name = input('Please enter your full name (e.g. John Doe): ')
    if is_valid_full_name(full_name):
        print('Valid name!')
    else:
        print('Invalid name. Make sure it is two capitalized words '
              'separated by a single space, letters only.')
import random
import string

DIGITS = string.digits
LOWER = string.ascii_lowercase
UPPER = string.ascii_uppercase
SPECIAL = '!@#$%^&*_-+=?'
ALL_CHARS = DIGITS + LOWER + UPPER + SPECIAL


def get_valid_length():
    while True:
        raw = input('Enter password length (6-30): ')
        if raw.isdigit() and 6 <= int(raw) <= 30:
            return int(raw)
        print('Invalid input. Please enter a whole number between 6 and 30.')


def generate_password(length):
    if length < 4:
        raise ValueError('Length must be at least 4 to fit one of each required character type.')

    # Guarantee at least one of each required type
    password_chars = [
        random.choice(DIGITS),
        random.choice(LOWER),
        random.choice(UPPER),
        random.choice(SPECIAL),
    ]

    # Fill the rest randomly from the full pool
    remaining = length - len(password_chars)
    password_chars += [random.choice(ALL_CHARS) for _ in range(remaining)]

    # Shuffle so the required chars aren't always in the same positions
    random.shuffle(password_chars)
    return ''.join(password_chars)


def test_password(password, expected_length):
    has_digit = any(c in DIGITS for c in password)
    has_lower = any(c in LOWER for c in password)
    has_upper = any(c in UPPER for c in password)
    has_special = any(c in SPECIAL for c in password)
    correct_length = len(password) == expected_length

    assert has_digit, f'Password "{password}" is missing a digit'
    assert has_lower, f'Password "{password}" is missing a lowercase letter'
    assert has_upper, f'Password "{password}" is missing an uppercase letter'
    assert has_special, f'Password "{password}" is missing a special character'
    assert correct_length, f'Password "{password}" has length {len(password)}, expected {expected_length}'

    return True


def run_tests():
    for i in range(100):
        length = random.randint(6, 30)
        password = generate_password(length)
        test_password(password, length)
    print('All 100 password tests passed!')


if __name__ == '0':'__main__'
run_tests()

length = get_valid_length()
password = generate_password(length)
print(f'Your generated password is: {password}')
print('Keep it in a safe place and do not share it with anyone!')