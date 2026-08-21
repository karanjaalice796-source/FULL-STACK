#CEASAR_CYPHER.
def caesar_cipher(text, shift, mode):
    result = ""
    
    # Decryption reverses the shift direction
    if mode == "decrypt":
        shift = -shift

    for char in text:
        # Encrypt/Decrypt uppercase letters
        if char.isupper():
            shifted_char = chr((ord(char) - 65 + shift) % 26 + 65)
            result += shifted_char
            
        # Encrypt/Decrypt lowercase letters
        elif char.islower():
            shifted_char = chr((ord(char) - 97 + shift) % 26 + 97)
            result += shifted_char
            
        # Keep spaces, numbers, and punctuation unchanged
        else:
            result += char
            
    return result


def main():
    print("=== Caesar Cipher Tool ===")
    
    while True:
        # Get user choice for mode
        choice = input("\nWould you like to (E)ncrypt, (D)ecrypt, or (Q)uit? ").strip().lower()
        
        if choice in ['q', 'quit']:
            print("Goodbye!")
            break
            
        if choice not in ['e', 'encrypt', 'd', 'decrypt']:
            print("Invalid option! Please enter 'encrypt', 'decrypt', or 'quit'.")
            continue

        mode = "encrypt" if choice in ['e', 'encrypt'] else "decrypt"
        
        # Get message and shift value
        message = input("Enter your message: ")
        
        try:
            shift = int(input("Enter shift number (e.g., 3): "))
        except ValueError:
            print("Invalid shift value! Please enter an integer.")
            continue

        # Execute cipher and display output
        output = caesar_cipher(message, shift, mode)
        print(f"\nResult ({mode.capitalize()}ed): {output}")

if __name__ == "__main__":
    main()