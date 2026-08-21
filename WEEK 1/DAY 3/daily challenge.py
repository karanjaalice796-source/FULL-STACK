#dictionaries
#letter index dictionary
# 1. User Input
word = input("Enter a word: ")

# 2. Creating the Dictionary
letter_indices = {}

for index, char in enumerate(word):
    if char in letter_indices:
        letter_indices[char].append(index)
    else:
        letter_indices[char] = [index]

# 3. Print Output
print(letter_indices)

#2. affprdable items
# Function to clean currency strings and convert to integer
def clean_price(price_str):
    cleaned = price_str.replace("$", "").replace(",", "").strip()
    return int(cleaned)

def get_affordable_items(items_purchase, wallet_str):
    # Data Cleaning for wallet
    wallet_balance = clean_price(wallet_str)
    
    basket = []

    # Iterate in order of priority (dictionary order)
    for item, price_str in items_purchase.items():
        price = clean_price(price_str)
        
        # Check if item is affordable
        if price <= wallet_balance:
            basket.append(item)
            wallet_balance -= price  # Update wallet after buying

    # Check if basket is empty
    if not basket:
        return "Nothing"
    
    # Return basket sorted alphabetically
    return sorted(basket)
