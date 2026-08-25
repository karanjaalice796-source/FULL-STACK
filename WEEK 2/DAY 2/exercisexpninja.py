import os
import time


class Cell:
    """Represents an individual cell in the Game of Life."""

    def __init__(self, is_alive=False):
        self.is_alive = is_alive

    def __str__(self):
        # Displays '█' for alive cells and '·' for dead cells
        return "█" if self.is_alive else "·"


class Grid:
    """Manages the 2D grid of cells and boundary operations."""

    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.grid = [
            [Cell(False) for _ in range(self.cols)] for _ in range(self.rows)
        ]

    def set_pattern(self, pattern, offset_row=0, offset_col=0):
        """Loads a pattern of live cells into the grid starting at an offset."""
        for r, c in pattern:
            row, col = r + offset_row, c + offset_col
            if 0 <= row < self.rows and 0 <= col < self.cols:
                self.grid[row][col].is_alive = True

    def count_live_neighbors(self, row, col):
        """Counts the 8 adjacent neighbors for a given cell position."""
        live_count = 0
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue  # Skip the cell itself

                r, c = row + dr, col + dc

                # Fixed borders: cells outside the boundaries are considered dead/exited
                if 0 <= r < self.rows and 0 <= c < self.cols:
                    if self.grid[r][c].is_alive:
                        live_count += 1
        return live_count

    def display(self, generation):
        """Clears the terminal and prints the current state of the grid."""
        os.system("cls" if os.name == "nt" else "clear")
        print(f"--- Generation {generation} ---")
        for row in self.grid:
            print(" ".join(str(cell) for cell in row))
        print("\nPress Ctrl+C to exit.")


class GameOfLife:
    """Controls the main game execution and state transitions."""

    def __init__(self, rows=20, cols=40, initial_pattern=None):
        self.grid = Grid(rows, cols)
        self.generation = 0

        if initial_pattern:
            # Center the pattern in the grid
            mid_r, mid_c = rows // 2, cols // 2
            self.grid.set_pattern(initial_pattern, offset_row=mid_r, offset_col=mid_c)

    def step(self):
        """Calculates the next generation based on Conway's rules."""
        # Determine next state for all cells without modifying grid mid-step
        next_states = [
            [False for _ in range(self.grid.cols)]
            for _ in range(self.grid.rows)
        ]

        for r in range(self.grid.rows):
            for c in range(self.grid.cols):
                is_alive = self.grid.grid[r][c].is_alive
                neighbors = self.grid.count_live_neighbors(r, c)

                # Rule 1 & 3: Underpopulation / Overpopulation -> Dies
                # Rule 2: 2 or 3 neighbors -> Lives
                # Rule 4: Dead cell with 3 neighbors -> Reproduction
                if is_alive and neighbors in (2, 3):
                    next_states[r][c] = True
                elif not is_alive and neighbors == 3:
                    next_states[r][c] = True

        # Apply calculated states
        for r in range(self.grid.rows):
            for c in range(self.grid.cols):
                self.grid.grid[r][c].is_alive = next_states[r][c]

        self.generation += 1

    def run(self, delay=0.15, max_generations=100):
        """Runs the simulation loop."""
        try:
            for _ in range(max_generations):
                self.grid.display(self.generation)
                self.step()
                time.sleep(delay)
        except KeyboardInterrupt:
            print("\nSimulation stopped.")


# Preset Initial Patterns (coordinates relative to center)
PATTERNS = {
    "glider": [(-1, 0), (0, 1), (1, -1), (1, 0), (1, 1)],
    "blinker": [(0, -1), (0, 0), (0, 1)],
    "pulsar": [
        (-6, -4), (-6, -3), (-6, -2), (-6, 2), (-6, 3), (-6, 4),
        (-4, -6), (-3, -6), (-2, -6), (2, -6), (3, -6), (4, -6),
        (-4, -1), (-3, -1), (-2, -1), (2, -1), (3, -1), (4, -1),
        (-4, 1),  (-3, 1),  (-2, 1),  (2, 1),  (3, 1),  (4, 1),
        (-4, 6),  (-3, 6),  (-2, 6),  (2, 6),  (3, 6),  (4, 6),
        (-1, -4), (-1, -3), (-1, -2), (-1, 2), (-1, 3), (-1, 4),
        (1, -4),  (1, -3),  (1, -2),  (1, 2),  (1, 3),  (1, 4),
        (6, -4),  (6, -3),  (6, -2),  (6, 2),  (6, 3),  (6, 4),
    ]
}

if __name__ == "__main__":
    # Change "glider" to "blinker" or "pulsar" to test different end states!
    game = GameOfLife(rows=20, cols=40, initial_pattern=PATTERNS["glider"])
    game.run(delay=0.1, max_generations=150)