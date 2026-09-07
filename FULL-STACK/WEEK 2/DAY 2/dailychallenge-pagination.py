import math


class Pagination:
    """Simulates a pagination system for navigating lists of items in pages."""

    def __init__(self, items=None, page_size=10):
        # Step 2: Initialize instance attributes
        self.items = items if items is not None else []
        self.page_size = int(page_size)
        self.current_idx = 0

        # Calculate total pages (handle empty list edge case)
        if len(self.items) == 0:
            self.total_pages = 1
        else:
            self.total_pages = math.ceil(len(self.items) / self.page_size)

    def get_visible_items(self):
        """Step 3: Return the items for the current page using slicing."""
        start_idx = self.current_idx * self.page_size
        end_idx = start_idx + self.page_size
        return self.items[start_idx:end_idx]

    # Alias for method chaining compatibility (camelCase support)
    getVisibleItems = get_visible_items

    # Step 4: Navigation Methods
    def go_to_page(self, page_num):
        """Navigate to a specific 1-based page number."""
        page_num = int(page_num)
        if page_num < 1 or page_num > self.total_pages:
            raise ValueError(
                f"Page {page_num} out of range. Valid range: 1 to {self.total_pages}."
            )
        self.current_idx = page_num - 1
        return self

    def first_page(self):
        """Navigate to the first page."""
        self.current_idx = 0
        return self

    def last_page(self):
        """Navigate to the last page."""
        self.current_idx = self.total_pages - 1
        return self

    def next_page(self):
        """Move one page forward if not on the last page."""
        if self.current_idx < self.total_pages - 1:
            self.current_idx += 1
        return self

    # CamelCase aliases for bonus chaining syntax
    goToPage = go_to_page
    firstPage = first_page
    lastPage = last_page
    nextPage = next_page

    def previous_page(self):
        """Move one page backward if not on the first page."""
        if self.current_idx > 0:
            self.current_idx -= 1
        return self

    previousPage = previous_page

    def __str__(self):
        """Step 5 (Bonus): Return visible items formatted on new lines."""
        return "\n".join(str(item) for item in self.get_visible_items())


# --- Step 6: Testing the Code ---
if __name__ == "__main__":
    alphabet_list = list("abcdefghijklmnopqrstuvwxyz")
    p = Pagination(alphabet_list, 4)

    # Test initial page
    print(p.get_visible_items())  # ['a', 'b', 'c', 'd']

    # Test next_page
    p.next_page()
    print(p.get_visible_items())  # ['e', 'f', 'g', 'h']

    # Test last_page
    p.last_page()
    print(p.get_visible_items())  # ['y', 'z']

    # Test Bonus Method Chaining
    p.first_page()
    result = p.nextPage().nextPage().nextPage().getVisibleItems()
    print(result)  # ['m', 'n', 'o', 'p']

    # Test string representation
    p.first_page()
    print("--- String Output ---")
    print(str(p))

    # Test Error Handling
    try:
        p.go_to_page(10)
    except ValueError as e:
        print(f"\nCaught expected error: {e}")

    try:
        p.go_to_page(0)
    except ValueError as e:
        print(f"Caught expected error: {e}")