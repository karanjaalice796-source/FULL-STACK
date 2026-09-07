#BANK ACCOUNT CLASSES.
class BankAccount:
    def __init__(self, username, password, balance=0):
        self.username = username
        self.password = password
        self.balance = balance
        self.authenticated = False

    def authenticate(self, username, password):
        if self.username == username and self.password == password:
            self.authenticated = True
            return True
        return False

    def deposit(self, amount):
        if not self.authenticated:
            raise Exception("Authentication required to make a deposit.")
        if amount <= 0:
            raise Exception("Deposit amount must be positive.")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if not self.authenticated:
            raise Exception("Authentication required to make a withdrawal.")
        if amount <= 0:
            raise Exception("Withdrawal amount must be positive.")
        if self.balance - amount < 0:
            raise Exception("Insufficient funds.")
        self.balance -= amount
        return self.balance


class MinimumBalanceAccount(BankAccount):
    def __init__(self, username, password, balance=0, minimum_balance=0):
        super().__init__(username, password, balance)
        self.minimum_balance = minimum_balance

    def withdraw(self, amount):
        if not self.authenticated:
            raise Exception("Authentication required to make a withdrawal.")
        if amount <= 0:
            raise Exception("Withdrawal amount must be positive.")
        if self.balance - amount < self.minimum_balance:
            raise Exception(f"Cannot withdraw below minimum balance of {self.minimum_balance}.")
        
        self.balance -= amount
        return self.balance

    #BONUS-ATM CLASS
    class ATM:
     def __init__(self, account_list, try_limit=2):
        # Validate account list
        if not isinstance(account_list, list) or not all(isinstance(acc, BankAccount) for acc in account_list):
            raise Exception("account_list must contain only BankAccount or MinimumBalanceAccount instances.")
        
        # Validate try limit
        try:
            if not isinstance(try_limit, int) or try_limit <= 0:
                raise Exception("try_limit must be a positive integer.")
            self.try_limit = try_limit
        except Exception as e:
            print(f"Error initializing try_limit: {e}. Setting default try_limit to 2.")
            self.try_limit = 2

        self.account_list = account_list
        self.current_tries = 0
        self.show_main_menu()

    def show_main_menu(self):
        while True:
            print("\n=== ATM MAIN MENU ===")
            print("1. Log in")
            print("2. Exit")
            choice = input("Select an option (1-2): ").strip()

            if choice == "1":
                username = input("Enter username: ")
                password = input("Enter password: ")
                if self.log_in(username, password):
                    break  # Exits if max tries exceeded and program shuts down
            elif choice == "2":
                print("Thank you for using the ATM. Goodbye!")
                break
            else:
                print("Invalid choice. Please enter 1 or 2.")

    def log_in(self, username, password):
        for account in self.account_list:
            if account.authenticate(username, password):
                print(f"\nWelcome back, {account.username}!")
                self.current_tries = 0  # Reset counter upon success
                self.show_account_menu(account)
                return False

        # If credentials don't match any account
        self.current_tries += 1
        print(f"Invalid credentials. Attempt {self.current_tries}/{self.try_limit}")

        if self.current_tries >= self.try_limit:
            print("\nYou have reached the maximum number of login attempts. System shutting down.")
            return True  # Signal to break main menu loop
        return False

    def show_account_menu(self, account):
        while True:
            print(f"\n--- Account Menu ({account.username}) ---")
            print(f"Current Balance: ${account.balance}")
            print("1. Deposit")
            print("2. Withdraw")
            print("3. Log out")
            choice = input("Select an option (1-3): ").strip()

            if choice == "1":
                try:
                    amount = float(input("Enter deposit amount: "))
                    account.deposit(amount)
                    print(f"Successfully deposited ${amount}. New balance: ${account.balance}")
                except Exception as e:
                    print(f"Error: {e}")

            elif choice == "2":
                try:
                    amount = float(input("Enter withdrawal amount: "))
                    account.withdraw(amount)
                    print(f"Successfully withdrew ${amount}. Remaining balance: ${account.balance}")
                except Exception as e:
                    print(f"Error: {e}")

            elif choice == "3":
                account.authenticated = False  # De-authenticate on log out
                print("Logged out successfully.")
                break
            else:
                print("Invalid option. Please enter 1, 2, or 3.")


# --- Testing the Implementation ---
if __name__ == "__main__":
    acc1 = BankAccount("alice", "pass123", balance=500)
    acc2 = MinimumBalanceAccount("bob", "secret456", balance=300, minimum_balance=50)

    # Launch ATM app
    atm = ATM(account_list=[acc1, acc2], try_limit=3)