# Step 1 & 2: Representing and Displaying the Board
def create_board():
    """Creates a 3x3 grid filled with spaces."""
    return [[" " for _ in range(3)] for _ in range(3)]

def display_board(board):
    """Prints the current state of the board in a clean format."""
    print("\n  0   1   2")
    for index, row in enumerate(board):
        print(f"{index} " + " | ".join(row))
        if index < 2:
            print("  ---------")
    print()

# Step 3: Getting Player Input with Validation
def player_input(board, player):
    """Prompts player for row and column until a valid, empty cell is chosen."""
    while True:
        try:
            prompt = f"Player {player}, enter row and column (0-2) separated by a space: "
            row, col = map(int, input(prompt).split())
            
            if row not in range(3) or col not in range(3):
                print("Invalid input! Row and column must be 0, 1, or 2.")
            elif board[row][col] != " ":
                print("That spot is already taken! Choose an empty spot.")
            else:
                return row, col
        except ValueError:
            print("Invalid format! Please enter two numbers separated by a space (e.g., '1 2').")

# Step 4: Checking for a Winner
def check_win(board, player):
    """Checks rows, columns, and diagonals for 3 matching symbols."""
    # Check rows and columns
    for i in range(3):
        if all(board[i][j] == player for j in range(3)):  # Row check
            return True
        if all(board[j][i] == player for j in range(3)):  # Column check
            return True

    # Check diagonals
    if all(board[i][i] == player for i in range(3)):      # Main diagonal
        return True
    if all(board[i][2 - i] == player for i in range(3)):  # Anti-diagonal
        return True

    return False

# Step 5: Checking for a Tie
def check_tie(board):
    """Returns True if all cells are filled, False otherwise."""
    for row in board:
        if " " in row:
            return False
    return True

# Step 6: Main Game Loop
def play():
    """Manages the full game flow."""
    board = create_board()
    current_player = "X"
    
    print("Welcome to Tic Tac Toe!")

    while True:
        display_board(board)
        
        # Get valid move and update board
        row, col = player_input(board, current_player)
        board[row][col] = current_player

        # Check terminal states
        if check_win(board, current_player):
            display_board(board)
            print(f"Congratulations! Player {current_player} wins!")
            break
        
        if check_tie(board):
            display_board(board)
            print("It's a tie!")
            break

        # Switch players
        current_player = "O" if current_player == "X" else "X"

if __name__ == "__main__":
    play()