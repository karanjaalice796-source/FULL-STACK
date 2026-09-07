#1. when will i retire?
# Hard-coded current date parameters
CURRENT_YEAR = 2026
CURRENT_MONTH = 8
CURRENT_DAY = 20

def get_age(year, month, day):
    # Base age calculation
    age = CURRENT_YEAR - year
    
    # Adjust age if birthday hasn't occurred yet this year
    if (CURRENT_MONTH, CURRENT_DAY) < (month, day):
        age -= 1
        
    return age

def can_retire(gender, date_of_birth):
    # Parse date of birth string "YYYY/MM/DD"
    dob_parts = date_of_birth.split("/")
    year = int(dob_parts[0])
    month = int(dob_parts[1])
    day = int(dob_parts[2])
    
    # Calculate current age
    age = get_age(year, month, day)
    
    # Determine retirement threshold by gender
    gender = gender.lower().strip()
    if gender == 'm':
        return age >= 67
    elif gender == 'f':
        return age >= 62
    else:
        return False

# Main Execution
user_gender = input("Enter your gender (m/f): ")
user_dob = input("Enter your date of birth (YYYY/MM/DD): ")

if can_retire(user_gender, user_dob):
    print("Congratulations! You can retire.")
else:
    print("You are not eligible for retirement yet.")

#2. Sum
def calculate_special_sum(X):
    # Convert integer to string to repeat digits
    str_x = str(X)
    
    # Generate concatenated terms
    term1 = int(str_x)
    term2 = int(str_x * 2)
    term3 = int(str_x * 3)
    term4 = int(str_x * 4)
    
    return term1 + term2 + term3 + term4

# Example Call:
result = calculate_special_sum(3)
print(f"Result for X=3: {result}")  # Output: 3702 (3 + 33 + 333 + 3333)

#3. double dice
import random

def throw_dice():
    # Simulate a single 6-sided die roll
    return random.randint(1, 6)

def throw_until_doubles():
    throw_count = 0
    
    while True:
        die1 = throw_dice()
        die2 = throw_dice()
        throw_count += 1
        
        # Stop rolling when doubles are reached
        if die1 == die2:
            break
            
    return throw_count

def main():
    # Collect results across 100 successful doubles runs
    throw_results = []
    
    for _ in range(100):
        throws_needed = throw_until_doubles()
        throw_results.append(throws_needed)
        
    # Calculate metrics
    total_throws = sum(throw_results)
    average_throws = total_throws / len(throw_results)
    
    # Display results
    print(f"Total throws: {total_throws}")
    print(f"Average throws to reach doubles: {average_throws:.2f}")

# Execute main process
if __name__ == "__main__":
    main()