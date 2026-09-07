#geometry.
import math

class Circle:
    def __init__(self, radius=1.0):
        self.radius = radius

    def perimeter(self):
        return 2 * math.pi * self.radius

    def area(self):
        return math.pi * (self.radius ** 2)

    def definition(self):
        print("A circle is a 2D geometric shape consisting of all points in a plane that are at a given distance (radius) from a central point.")


# Test Circle class
c1 = Circle(5)
print(f"Perimeter: {c1.perimeter():.2f}")
print(f"Area: {c1.area():.2f}")
c1.definition()

#custom list class.
import random

class MyList:
    def __init__(self, letters):
        self.letters = letters

    def get_reversed(self):
        return list(reversed(self.letters))

    def get_sorted(self):
        return sorted(self.letters)

    # Bonus method
    def generate_random_numbers(self):
        return [random.randint(1, 100) for _ in range(len(self.letters))]


# Test MyList class
my_letters = MyList(['d', 'a', 'c', 'b'])
print(f"Reversed: {my_letters.get_reversed()}")
print(f"Sorted: {my_letters.get_sorted()}")
print(f"Random Numbers List: {my_letters.generate_random_numbers()}")

#restaurant menu manager
class MenuManager:
    def __init__(self):
        self.menu = [
            {"name": "Soup", "price": 10, "spice": "B", "gluten": False},
            {"name": "Hamburger", "price": 15, "spice": "A", "gluten": True},
            {"name": "Salad", "price": 18, "spice": "A", "gluten": False},
            {"name": "French Fries", "price": 5, "spice": "C", "gluten": False},
            {"name": "Beef bourguignon", "price": 25, "spice": "B", "gluten": True}
        ]

    def add_item(self, name, price, spice, gluten):
        new_dish = {
            "name": name,
            "price": price,
            "spice": spice,
            "gluten": gluten
        }
        self.menu.append(new_dish)
        print(f"Successfully added '{name}' to the menu.")

    def update_item(self, name, price, spice, gluten):
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                dish["price"] = price
                dish["spice"] = spice
                dish["gluten"] = gluten
                print(f"Successfully updated '{name}'.")
                return
        print(f"Error: '{name}' is not in the menu.")

    def remove_item(self, name):
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                self.menu.remove(dish)
                print(f"Successfully deleted '{name}'.")
                print("Updated Menu:", self.menu)
                return
        print(f"Error: '{name}' is not in the menu.")


# Testing MenuManager
manager = MenuManager()

# Add a dish
manager.add_item("Tacos", 12, "C", True)

# Update a dish
manager.update_item("Soup", 12, "B", False)

# Try updating a non-existent dish
manager.update_item("Pizza", 20, "A", True)

# Remove a dish
manager.remove_item("Salad")
