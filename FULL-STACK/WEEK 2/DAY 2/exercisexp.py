#1. PETS
class Pets():
    def __init__(self, animals):
        self.animals = animals

    def walk(self):
        for animal in self.animals:
            print(animal.walk())

class Cat():
    is_lazy = True

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def walk(self):
        return f'{self.name} is just walking around'

class Bengal(Cat):
    def sing(self, sounds):
        return f'{sounds}'

class Chartreux(Cat):
    def sing(self, sounds):
        return f'{sounds}'

# Step 1: Create the Siamese class inheriting from Cat
class Siamese(Cat):
    pass

# Step 2: Create a list of cat instances
cat_bengal = Bengal("Leo", 3)
cat_chartreux = Chartreux("Luna", 5)
cat_siamese = Siamese("Milo", 2)

all_cats = [cat_bengal, cat_chartreux, cat_siamese]

# Step 3: Create a Pets instance
sara_pets = Pets(all_cats)

# Step 4: Take cats for a walk
sara_pets.walk()

#2. DOGS
class Dog:
    # Step 1: Define Dog class and methods
    def __init__(self, name, age, weight):
        self.name = name
        self.age = age
        self.weight = weight

    def bark(self):
        return f"{self.name} is barking"

    def run_speed(self):
        return (self.weight / self.age) * 10

    def fight(self, other_dog):
        my_power = self.run_speed() * self.weight
        other_power = other_dog.run_speed() * other_dog.weight

        if my_power > other_power:
            return f"{self.name} won the fight against {other_dog.name}!"
        elif other_power > my_power:
            return f"{other_dog.name} won the fight against {self.name}!"
        else:
            return f"The fight between {self.name} and {other_dog.name} was a tie!"

# Step 2: Create dog instances
dog1 = Dog("Rex", 4, 20)
dog2 = Dog("Sparky", 2, 10)
dog3 = Dog("Max", 5, 30)

# Step 3: Test dog methods
print(dog1.bark())
print(f"{dog2.name}'s run speed: {dog2.run_speed()}")
print(dog1.fight(dog2))
print(dog2.fight(dog3))

#3. DOGS DOMESTICATED.
import random

# Step 1: Dog class definition (included here so file runs independently)
class Dog:
    def __init__(self, name, age, weight):
        self.name = name
        self.age = age
        self.weight = weight

    def bark(self):
        return f"{self.name} is barking"

    def run_speed(self):
        return (self.weight / self.age) * 10

    def fight(self, other_dog):
        my_power = self.run_speed() * self.weight
        other_power = other_dog.run_speed() * other_dog.weight
        if my_power > other_power:
            return f"{self.name} won the fight!"
        return f"{other_dog.name} won the fight!"


# Step 2: Create PetDog class inheriting from Dog
class PetDog(Dog):
    def __init__(self, name, age, weight):
        super().__init__(name, age, weight)
        self.trained = False

    def train(self):
        print(self.bark())
        self.trained = True

    def play(self, *args):
        # Extract names if arguments are strings or Dog instances
        names = [self.name]
        for arg in args:
            if isinstance(arg, Dog):
                names.append(arg.name)
            else:
                names.append(str(arg))
        dog_names = ", ".join(names)
        print(f"{dog_names} all play together")

    def do_a_trick(self):
        if self.trained:
            tricks = [
                "does a barrel roll",
                "stands on his back legs",
                "shakes your hand",
                "plays dead"
            ]
            print(f"{self.name} {random.choice(tricks)}")
        else:
            print(f"{self.name} is not trained yet!")


# Step 3: Test PetDog methods
my_dog = PetDog("Fido", 2, 10)
friend_dog1 = PetDog("Buddy", 3, 15)
friend_dog2 = PetDog("Max", 1, 8)

my_dog.train()
my_dog.play(friend_dog1, friend_dog2)
my_dog.do_a_trick()

#4. FAMILY AND PERSON CLASSES.
# Step 1: Create Person class
class Person:
    def __init__(self, first_name, age):
        self.first_name = first_name
        self.age = age
        self.last_name = ""

    def is_18(self):
        return self.age >= 18


# Step 2: Create Family class
class Family:
    def __init__(self, last_name):
        self.last_name = last_name
        self.members = []

    def born(self, first_name, age):
        new_person = Person(first_name, age)
        new_person.last_name = self.last_name
        self.members.append(new_person)

    def check_majority(self, first_name):
        for member in self.members:
            if member.first_name.lower() == first_name.lower():
                if member.is_18():
                    print("You are over 18, your parents Jane and John accept that you will go out with your friends")
                else:
                    print("Sorry, you are not allowed to go out with your friends.")
                return
        print(f"No family member named '{first_name}' was found.")

    def family_presentation(self):
        print(f"\n--- {self.last_name} Family ---")
        for member in self.members:
            print(f"First Name: {member.first_name}, Age: {member.age}")


# Testing expected behavior
smith_family = Family("Smith")

# Add members
smith_family.born("Michael", 20)
smith_family.born("Emma", 15)

# Presentation
smith_family.family_presentation()

# Check majority
smith_family.check_majority("Michael")
smith_family.check_majority("Emma")