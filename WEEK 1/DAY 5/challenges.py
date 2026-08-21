#1: Insert item at index
def insert_item(lst, item, index):
    return lst[:index] + [item] + lst[index:]

print(insert_item([1, 2, 4], 3, 2))  

#2: Count spaces in a string
def count_spaces(text):
    spaces = 0
    for char in text:
        if char == ' ':
            spaces += 1
    return spaces

print(count_spaces("Hello World Python"))

#3: Count upper and lower case letters
def count_cases(text):
    upper = 0
    lower = 0
    for char in text:
        if char.isupper():
            upper += 1
        elif char.islower():
            lower += 1
    return f"Upper: {upper}, Lower: {lower}"

print(count_cases("Hello World!"))  

#4: Custom sum function
def my_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(my_sum([1, 5, 4, 2]))  

#5: Find max number
def find_max(numbers):
    max_num = numbers[0]
    for num in numbers:
        if num > max_num:
            max_num = num
    return max_num

print(find_max([0, 1, 3, 50])) 

#6: Factorial of a number
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(factorial(4)) 

#7: Custom element count in a list
def list_count(lst, element):
    count = 0
    for item in lst:
        if item == element:
            count += 1
    return count

print(list_count(['a', 'a', 't', 'o'], 'a')) 

#8: L2-norm (Euclidean norm)
def norm(lst):
    sum_squares = 0
    for x in lst:
        sum_squares += x ** 2
    return sum_squares ** 0.5

print(norm([1, 2, 2])) 

#9: Chedef is_mono(lst):
def is_mono(lst):
    increasing = True
    decreasing = True
    
    for i in range(len(lst) - 1):
        if lst[i] > lst[i + 1]:
            increasing = False
        if lst[i] < lst[i + 1]:
            decreasing = False
            
    return increasing or decreasing


print(is_mono([7, 6, 5, 5, 2, 0]))
print(is_mono([2, 3, 3, 3]))     
print(is_mono([1, 2, 0, 4]))   

#10: Print longest word in a list
def print_longest_word(words):
    longest = words[0]
    for word in words:
        if len(word) > len(longest):
            longest = word
    print(longest)

print_longest_word(["python", "javascript", "c", "html"]) 

#11: Separate integers and strings
def separate_types(mixed_list):
    integers = []
    strings = []
    for item in mixed_list:
        if isinstance(item, int) and not isinstance(item, bool):
            integers.append(item)
        elif isinstance(item, str):
            strings.append(item)
    return integers, strings

print(separate_types([1, "cat", 42, "dog", 100]))

#12: Check palindrome
def is_palindrome(text):
    clean_text = text.lower()
    return clean_text == clean_text[::-1]

print(is_palindrome('radar')) 
print(is_palindrome('John'))  

#13: Count words longer than k
def sum_over_k(sentence, k):
    words = sentence.split()
    count = 0
    for word in words:
        if len(word) > k:
            count += 1
    return count

sentence = 'Do or do not there is no try'
print(sum_over_k(sentence, 2))

#14: Dictionary average value
def dict_avg(d):
    total = 0
    for value in d.values():
        total += value
    return total / len(d)

print(dict_avg({'a': 1, 'b': 2, 'c': 8, 'd': 1})) 

#15: Common divisors
def common_div(a, b):
    divisors = []
    min_val = a if a < b else b
    for i in range(2, min_val + 1):
        if a % i == 0 and b % i == 0:
            divisors.append(i)
    return divisors

print(common_div(10, 20))  

#16: Test for prime number
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print(is_prime(11))
print(is_prime(12))

#17: Print elements where index and value are even
def weird_print(lst):
    result = []
    for index, value in enumerate(lst):
        if index % 2 == 0 and value % 2 == 0:
            result.append(value)
    return result

print(weird_print([1, 2, 2, 3, 4, 5])) 

#18: Keyword arguments type counter
def type_count(**kwargs):
    counts = {}
    for value in kwargs.values():
        val_type = type(value).__name__
        counts[val_type] = counts.get(val_type, 0) + 1
    
    formatted = [f"{k}: {v}" for k, v in counts.items()]
    return ", ".join(formatted)

print(type_count(a=1, b='string', c=1.0, d=True, e=False))

#19: cistom split function
def custom_split(text, delimiter=None):
    result = []
    current_word = ""
    
    for char in text:
        is_delimiter = char.isspace() if delimiter is None else char == delimiter
        
        if is_delimiter:
            if current_word or delimiter is not None:
                result.append(current_word)
                current_word = ""
        else:
            current_word += char
            
    if current_word or delimiter is not None:
        result.append(current_word)
        
    return result

print(custom_split("hello world python"))    
print(custom_split("apple,banana,grape", ","))  

#20:Convert string to password mask
def mask_password(password):
    return "*" * len(password)


print(mask_password("mypassword")) 