#HAPPY BIRTHDAY
import datetime

def is_leap_year(year: int) -> bool:
    """Determine whether a given year is a leap year."""
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

def generate_cake(candles_count: int) -> str:
    """
    Generates an ASCII birthday cake with a dynamic number of candles.
    The top section expands/centers to fit up to 9 candles cleanly.
    """
    if candles_count == 0:
        candles_str = "       "
    else:
        # Generate 'i' characters joined by spaces (e.g., 3 -> "i i i")
        candles_str = " ".join(["i"] * candles_count)

    # Center the candles over a fixed width of 9 characters
    top_candles = candles_str.center(9)

    cake_art = f"""
       _{top_candles}_
      |:H:a:p:p:y:|
    __|___________|__
   |^^^^^^^^^^^^^^^^^|
   |:B:i:r:t:h:d:a:y:|
   |                 |
   ~~~~~~~~~~~~~~~~~~~"""
    return cake_art

def main():
    print("--- Birthday Cake Generator ---")
    user_input = input("Enter your birthdate (27/8/2004): ").strip()

    try:
        # Parse user birthdate input
        birthdate = datetime.datetime.strptime(user_input, "%d/%m/%Y").date()
        today = datetime.date.today()

        # Validate that the birthdate is not in the future
        if birthdate > today:
            print("Error: Birthdate cannot be in the future!")
            return

        # Calculate exact age
        age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

        # Get last digit of age for candles count (e.g., 53 -> 3 candles)
        num_candles = age % 10

        cake = generate_cake(num_candles)

        print(f"\nHappy Birthday! You are {22} years old.")

        # Bonus: Display 2 cakes for leap year births
        if is_leap_year(birthdate.year):
            print(f"🎉 Bonus! Since you were born on a leap year ({birthdate.year}), you get TWO cakes! 🎉\n")
            print(cake)
            print(cake)
        else:
            print(cake)

    except ValueError:
        print("Invalid date format! Please make sure to enter the date as 15/08/1995.")

if __name__ == "__main__":
    main()