#
# Ask the user for a number
num = int(input("Enter the number: "))

# A perfect number is a positive integer equal to the sum of its proper divisors
if num > 0:
    # Find all proper divisors (excluding the number itself) and sum them up
    divisors_sum = sum(i for i in range(1, num) if num % i == 0)
    
    # Print True if the sum matches the number, else False
    print(divisors_sum == num)
else:
    print(False)