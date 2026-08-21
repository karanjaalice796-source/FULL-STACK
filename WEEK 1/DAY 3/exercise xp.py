#1. converting lists into dictionaries
keys = ['Ten', 'Twenty', 'Thirty']
values = [10, 20, 30]

# Approach 1: Using dict() and zip()
brand_dict = dict(zip(keys, values))
print(brand_dict)

# Approach 2: Using Dictionary Comprehension
brand_dict_comp = {k: v for k, v in zip(keys, values)}
print(brand_dict_comp)

#2. cinemax#2
# Standard Exercise
family = {"rick": 43, 'beth': 13, 'morty': 5, 'summer': 8}
total_cost = 0

for name, age in family.items():
    if age < 3:
        price = 0
    elif 3 <= age <= 12:
        price = 10
    else:
        price = 15
    
    total_cost += price
    print(f"{name.capitalize()} has to pay ${price}.")

print(f"\nTotal Cost: ${total_cost}")

# --- BONUS: User Input Version ---
print("\n--- Bonus: Interactive Ticket Calculator ---")
custom_family = {}

while True:
    name = input("Enter family member's name (or type 'done' to finish): ").strip()
    if name.lower() == 'done':
        break
    age = int(input(f"Enter {name}'s age: "))
    custom_family[name] = age

bonus_total = 0
for name, age in custom_family.items():
    if age < 3:
        price = 0
    elif 3 <= age <= 12:
        price = 10
    else:
        price = 15
    
    bonus_total += price
    print(f"{name.capitalize()} pays ${price}.")

print(f"Final Total: ${bonus_total}")

#3. zara
# 1. Create the dictionary
brand = {
    "name": "Zara",
    "creation_date": 1975,
    "creator_name": "Amancio Ortega Gaona",
    "type_of_clothes": ["men", "women", "children", "home"],
    "international_competitors": ["Gap", "H&M", "Benetton"],
    "number_stores": 7000,
    "major_color": {
        "France": "blue",
        "Spain": "red",
        "US": ["pink", "green"]
    }
}

# 2. Change the value of number_stores to 2
brand["number_stores"] = 2

# 3. Print a sentence describing Zara's clients using the type_of_clothes key
clothes = ", ".join(brand["type_of_clothes"])
print(f"Zara provides clothes for {clothes}.")

# 4. Add a new key country_creation with value Spain
brand["country_creation"] = "Spain"

# 5. Check if international_competitors exists and add "Desigual"
if "international_competitors" in brand:
    brand["international_competitors"].append("Desigual")

# 6. Delete the creation_date key
brand.pop("creation_date")

# 7. Print the last item in international_competitors
print(f"Last competitor: {brand['international_competitors'][-1]}")

# 8. Print the major colors in the US
print(f"US major colors: {brand['major_color']['US']}")

# 9. Print the number of keys in the dictionary
print(f"Number of keys: {len(brand)}")

# 10. Print all keys of the dictionary
print(f"Keys in brand dict: {list(brand.keys())}")

# --- BONUS ---
more_on_zara = {
    "creation_date": 1975,
    "number_stores": 10000
}

brand.update(more_on_zara)
print("\nUpdated brand dictionary with more_on_zara:")
print(brand)

#4. Disney Characters
users = ["Mickey", "Minnie", "Donald", "Ariel", "Pluto"]

# 1. Map characters to their indices
disney_dict_1 = {user: index for index, user in enumerate(users)}
print("Pattern 1:", disney_dict_1)

# 2. Map indices to characters
disney_dict_2 = {index: user for index, user in enumerate(users)}
print("Pattern 2:", disney_dict_2)

# 3. Characters sorted alphabetically mapped to indices
disney_dict_3 = {user: index for index, user in enumerate(sorted(users))}
print("Pattern 3:", disney_dict_3)