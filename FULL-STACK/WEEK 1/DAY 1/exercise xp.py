#hello world
print("Hello world\n" * 4)

#math
print((99**3) * 8)

#what is the output?
5 < 3
3 == 3  
3 == "3" 
"3" > 3 
"Hello" == "hello"

#your computer brand
computer_brand = "Lenovo"
print(f"I have a {computer_brand} computer.")

#your information
name = "Karanja"
age = 23
shoe_size = 42
info = f"My name is {name}, I am {age} years old, and I wear size {shoe_size} shoes while coding!"
print(info)

#A & B
a = 10
b = 5

if a > b:
    print("Hello World")
    #Old or even
number = int(input("Enter a number: "))

if number % 2 == 0:
    print("The number is even.")
else:
    print("The number is odd.")

      #What's your name
user_name = input("What is your name? ")
my_name = "Karanja"

if user_name.strip().title() == my_name:
    print("Wait, you're named Karanja too? Did we just become best friends?!")
else:
    print(f"Nice to meet you, {user_name}! Sadly, it's no match for the glorious name '{my_name}'.")

    #Tall enough to ride a roller coaster
height = float(input("Enter your height in cm: "))

if height > 145:
    print("You are tall enough to ride! Enjoy the coaster!")
else:
    print("Sorry, you need to grow a bit more before riding this one.")