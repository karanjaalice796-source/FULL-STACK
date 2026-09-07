# CARS SOLUTION.
# 1. Initial string setup
cars_string = "Volkswagen, Toyota, Ford Motor, Honda, Chevrolet"

# 2. Convert to a list (splitting by comma and removing trailing spaces)
manufacturers = [company.strip() for company in cars_string.split(",")]

# 3. Print the number of companies
print(f"Number of manufacturers in list: {len(manufacturers)}")

# 4. Print list in reverse/descending alphabetical order (Z-A)
descending_list = sorted(manufacturers, reverse=True)
print(f"Descending order (Z-A): {descending_list}")

# 5. Count companies with 'o' (case-insensitive)
with_o = len([c for c in manufacturers if 'o' in c.lower()])
print(f"Manufacturers with 'o': {with_o}")

# 6. Count companies without 'i' (case-insensitive)
without_i = len([c for c in manufacturers if 'i' not in c.lower()])
print(f"Manufacturers without 'i': {without_i}")


# --- BONUS 1: Remove Duplicates ---
print("\n--- Bonus 1: Deduplication ---")
duplicate_list = ["Honda", "Volkswagen", "Toyota", "Ford Motor", "Honda", "Chevrolet", "Toyota"]

# Preserve uniqueness using set, then sort to maintain consistent order
unique_companies = sorted(list(set(duplicate_list)))

# Print as comma-separated string without line-breaks
formatted_string = ", ".join(unique_companies)
print(f"Companies: {formatted_string}")
print(f"Total unique companies: {len(unique_companies)}")


# --- BONUS 2: Ascending Order + Reversed Letters ---
print("\n--- Bonus 2: Reversed Name Letters ---")

# Sort A-Z first, then reverse the characters of each company name
reversed_names_list = [company[::-1] for company in sorted(unique_companies)]
print(f"Ascending sorted with reversed names: {reversed_names_list}")