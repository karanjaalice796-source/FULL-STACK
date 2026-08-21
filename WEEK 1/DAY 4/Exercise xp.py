#1. what are you learning?
# Step 1: Define the function
def display_message():
    # Step 2: Print the message
    print("I am learning about functions in Python.")

# Step 3: Call the function
display_message()

#2. What’s Your Favorite Book?
# Step 1: Define function with parameter
def favorite_book(title):
    # Step 2: Print formatted message
    print(f"One of my favorite books is {title}.")

# Step 3: Call the function with an argument
favorite_book("Alice in Wonderland")

#3. Some Geography
# Step 1: Define function with a default parameter
def describe_city(city, country="Unknown"):
    # Step 2: Print message
    print(f"{city} is in {country}.")

# Step 3: Call function with and without second argument
describe_city("Reykjavik", "Iceland")
describe_city("Paris")

#4. randam
import random

def check_random_number(user_number):
    # Generate random number between 1 and 100
    random_num = random.randint(1, 100)
    
    # Compare numbers
    if user_number == random_num:
        print("Success!")
    else:
        print(f"Fail! Your number: {user_number}, Random number: {random_num}")

# Call the function
check_random_number(50)

#5. Let’s Create Some Personalized Shirts!
# Function with default parameters
def make_shirt(size="large", text="I love Python"):
    print(f"The size of the shirt is {size} and the text is {text}.")

# Large shirt with default message
make_shirt()

# Medium shirt with default message
make_shirt(size="medium")

# Custom size with custom message (Positional arguments)
make_shirt("small", "Custom message")

# Bonus: Using Keyword Arguments
make_shirt(text="Hello!", size="small")

#6. magicians...
magician_names = ['Harry Houdini', 'David Blaine', 'Criss Angel']

def show_magicians(magicians):
    for magician in magicians:
        print(magician)

def make_great(magicians):
    for i in range(len(magicians)):
        magicians[i] = f"{magicians[i]} the Great"

# Modify list and display results
make_great(magician_names)
show_magicians(magician_names)

#7. temperature advice
import random

# Base function using random.uniform (Bonus 4: Floating-point numbers)
def get_random_temp(season=None):
    # Bonus 5: Season-specific temperature ranges
    if season == "winter":
        return round(random.uniform(-10.0, 10.0), 1)
    elif season == "spring":
        return round(random.uniform(10.0, 20.0), 1)
    elif season == "summer":
        return round(random.uniform(24.0, 40.0), 1)
    elif season == "autumn" or season == "fall":
        return round(random.uniform(5.0, 18.0), 1)
    else:
        return round(random.uniform(-10.0, 40.0), 1)

def main():
    # Ask for month input to determine season (Bonus 5)
    try:
        month = int(input("Enter the month number (1-12): "))
        if month in [12, 1, 2]:
            season = "winter"
        elif month in [3, 4, 5]:
            season = "spring"
        elif month in [6, 7, 8]:
            season = "summer"
        elif month in [9, 10, 11]:
            season = "autumn"
        else:
            season = None
    except ValueError:
        season = None

    # Get random temperature based on selected season
    temp = get_random_temp(season)
    print(f"The temperature right now is {temp} degrees Celsius.")

    # Temperature-based advice
    if temp < 0:
        print("Brrr, that's freezing! Wear some extra layers today.")
    elif 0 <= temp < 16:
        print("Quite chilly! Don't forget your coat.")
    elif 16 <= temp < 24:
        print("Nice weather.")
    elif 24 <= temp < 32:
        print("A bit warm, stay hydrated.")
    else:
        print("It's really hot! Stay cool.")

# Run the program
main()