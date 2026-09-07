#Hello World-I love Python
print(("Hello world\n" * 4) + ("I love python\n" * 4).strip())

#What is the Season?
month = int(input("Enter a month number (1-12): "))

if month in [3, 4, 5]:
    season = "Spring"
elif month in [6, 7, 8]:
    season = "Summer"
elif month in [9, 10, 11]:
    season = "Autumn"
elif month in [1, 2, 12]:
    season = "Winter"
else:
    season = "Invalid month number"

print(f"Season: {season}")