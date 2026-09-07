#pattern 1: Centered Pyramid
rows = 3
for i in range(1, rows + 1):
    spaces = " " * (rows - i)
    stars = "*" * (2 * i - 1)
    print(spaces + stars)

#pattern 2: Right-Aligned Triangle
rows = 5
for i in range(1, rows + 1):
    spaces = " " * (rows - i)
    stars = "*" * i
    print(spaces + stars)

#pattern 3: Hourglass / Double Diamond
n = 5

# Top half (Left-aligned growing triangle)
for i in range(1, n + 1):
    print("*" * i)

# Bottom half (Right-aligned shrinking triangle)
for i in range(n, 0, -1):
    spaces = " " * (n - i)
    stars = "*" * i
    print(spaces + stars)

#Line-by-Line Code Comments
my_list = [2, 24, 12, 354, 233] # Initialize unsorted list of integers

# Loop over each index except the last one (i = 0, 1, 2, 3)
for i in range(len(my_list) - 1): 
    minimum = i # Assume current index 'i' holds the smallest value
    
    # Check all remaining elements to the right of 'i'
    for j in range(i + 1, len(my_list)): 
        
        # Check if element at 'j' is smaller than our current minimum
        if (my_list[j] < my_list[minimum]): 
            minimum = j # Update 'minimum' index to point to 'j'
            
            # SWAP BUG: Swaps immediately when a smaller element is found,
            # rather than waiting to find the actual minimum across the whole inner loop.
            if (minimum != i): 
                my_list[i], my_list[minimum] = my_list[minimum], my_list[i]

print(my_list) 