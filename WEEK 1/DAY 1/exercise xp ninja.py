#Terminal & PATH Concept
#bash:
print('Alias py="python3"')

#PowerShell (Windows):
print("Set-Alias -Name py -Value python")

#Code Output Predictions
# Part 1: Predictions in interactive mode
3 <= 3 < 9                        
3 == 3 == 3                   
bool(0)                          
bool(5 == "5")                  
bool(4 == 4) == bool("4" == "4")  
bool(bool(None))        

# Part 2: Print statements output
x = (1 == True)                   
y = (1 == False)                
a = True + 4  
b = False + 10     

print("x is", x)       
print("y is", y)        
print("a:", a)         
print("b:", b)

#character count in one line
my_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

print(len(my_text))

#Longest Input Without the Letter "A"
longest_length = 0

while True:
    user_input = input("Enter a sentence without 'A' (or type 'quit' to exit): ")
    
    if user_input.lower() == "quit":
        print("Thanks for playing!")
        break
        
    if "a" in user_input.lower():
        print("Failed! Your sentence contains the letter 'A'. Try again.")
    else:
        current_len = len(user_input)
        if current_len > longest_length:
            longest_length = current_len
            print(f"Congratulations! New longest sentence with {longest_length} characters.")
        else:
            print(f"Valid sentence, but not your longest yet (Current record: {longest_length} chars).")