class Farm:
    def __init__(self, farm_name):
        self.name = farm_name
        self.animals = {}

    # Step 3 & Step 8 (Bonus Upgrade): Handles both single arguments and **kwargs
    def add_animal(self, animal_type=None, count=1, **kwargs):
        # Handle standard positional arguments
        if animal_type:
            if animal_type in self.animals:
                self.animals[animal_type] += count
            else:
                self.animals[animal_type] = count

        # Handle **kwargs (e.g., macdonald.add_animal(cow=5, sheep=2))
        for animal, qty in kwargs.items():
            if animal in self.animals:
                self.animals[animal] += qty
            else:
                self.animals[animal] = qty

    # Step 4: Format animal info with proper alignment
    def get_info(self):
        info = f"{self.name}'s farm\n\n"
        for animal, qty in self.animals.items():
            info += f"{animal:<7} : {qty}\n"
        info += "\n    E-I-E-I-0!"
        return info

    # Step 6 (Bonus): Sorted list of animal types
    def get_animal_types(self):
        return sorted(list(self.animals.keys()))

    # Step 7 (Bonus): Short summary with pluralized names
    def get_short_info(self):
        sorted_types = self.get_animal_types()
        plural_animals = []

        for animal in sorted_types:
            # Add 's' if count > 1
            if self.animals[animal] > 1:
                plural_animals.append(f"{animal}s")
            else:
                plural_animals.append(animal)

        # Join with commas and "and" for the last item
        if len(plural_animals) == 1:
            animal_str = plural_animals[0]
        elif len(plural_animals) == 2:
            animal_str = " and ".join(plural_animals)
        else:
            animal_str = ", ".join(plural_animals[:-1]) + f" and {plural_animals[-1]}"

        return f"{self.name}'s farm has {animal_str}."


# --- Testing Step 1 to Step 5 ---
macdonald = Farm("McDonald")
macdonald.add_animal('cow', 5)
macdonald.add_animal('sheep')
macdonald.add_animal('sheep')
macdonald.add_animal('goat', 12)

print(macdonald.get_info())

# --- Testing Step 6 to Step 8 (Bonus Features) ---
print("\n" + "=" * 30 + "\n")

# Testing get_animal_types()
print("Sorted animal types:", macdonald.get_animal_types())

# Testing get_short_info()
print(macdonald.get_short_info())

# Testing upgraded add_animal with **kwargs
macdonald.add_animal(duck=3, horse=1)
print(macdonald.get_short_info())
