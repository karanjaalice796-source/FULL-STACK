#HAPPY BIRTHDAY
import datetime

def is_leap_year(year):
    """Check if a given year is a leap year."""
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

def draw_cake(candles_count):
    """Draw a cake with a dynamic number of candles centered on top."""
    # Build candle string (e.g., 3 candles -> 'i i i')
    if candles_count == 0:
        candle_str = "     "
    else:
        candle_str = " ".join(["i"] * candles_count)
    
    # Center the candles over a 5-space width block top
    centered_candles = candle_str.center(5)

    cake = f"""
       ___{centered_candles}___
      |:H:a:p:p:y:|
    __|___________|__
   |^^^^^^^^^^^^^^^^^|
   |:B:i:r:t:h:d:a:y:|
   |                 |
   ~~~~~~~~~~~~~~~~~~~"""
    return cake

# 1. Ask for input
user_input = input("Enter your birthdate (29/02/2004): ")

try:
    # Parse the birthdate
    birthdate = datetime.datetime.strptime(user_input, "%d/%m/%Y").date()
    today = datetime.date.today()

    # 2. Calculate age
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

    # 3. Get the last digit of the age for candles count
    last_digit = age % 10

    # 4. Generate the cake
    single_cake = draw_cake(last_digit)

    print(f"\nYou are {age} years old!")

    # 5. Bonus check: Dual cakes for leap year births
    if is_leap_year(birthdate.year):
        print(f"You were born in a leap year ({birthdate.year})! You get TWO cakes! 🎂🎂\n")
        print(single_cake)
        print(single_cake)
    else:
        print(single_cake)

except ValueError:
    print("Invalid date format! Please enter your birthdate in DD/MM/YYYY format.")