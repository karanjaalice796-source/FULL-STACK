
// Ex1: Location
const person = {
	name: "Peter John",
	age: 25,
	location: {
		country: "Canada",
		city: "Vancouver",
		coordinates: [49.2827, -123.1207],
	},
};

const {
	name,
	location: { country, city, coordinates: [lat, lng] },
} = person;

console.log(
	`I am ${name} from ${city}, ${country}. Latitude(${lat}), Longitude(${lng})`,
);

// Exercise 2: Display Student Info
function displayStudentInfo({ first, last }) {
	return `Your full name is ${first} ${last}`;
}

console.log(displayStudentInfo({ first: "Elie", last: "Schoppik" }));

// Exercise 3: User and ID
const users = { user1: 18273, user2: 92833, user3: 90315 };
const usersArray = Object.entries(users);
console.log(usersArray);

const doubledUsers = usersArray.map(([user, id]) => [user, id * 2]);
console.log(doubledUsers);

// Exercise 4: Person class
class Person {
	constructor(personName) {
		this.name = personName;
	}
}

const member = new Person("John");
console.log(typeof member);

// Exercise 5: Dog class
class Dog {
	constructor(dogName) {
		this.name = dogName;
	}
}

class Labrador extends Dog {
	constructor(dogName, size) {
		super(dogName);
		this.size = size;
	}
}

const labrador = new Labrador("Max", "large");
console.log(labrador);

// Exercise 6: Challenges
function areSameReference(firstValue, secondValue) {
	return firstValue === secondValue;
}

console.log(areSameReference([2], [2]));
console.log(areSameReference({}, {}));

const object1 = { number: 5 };
const object2 = object1;
const object3 = object2;
const object4 = { number: 5 };

object1.number = 4;
console.log(object2.number);
console.log(object3.number);
console.log(object4.number);

class Animal {
	constructor(animalName, animalType, animalColor) {
		this.name = animalName;
		this.type = animalType;
		this.color = animalColor;
	}
}

class Mammal extends Animal {
	sound(animalSound) {
		return `${animalSound} I'm a ${this.type}, named ${this.name} and I'm ${this.color}`;
	}
}

const farmerCow = new Mammal("Lily", "cow", "brown and white");
console.log(farmerCow.sound("Moooo"));
