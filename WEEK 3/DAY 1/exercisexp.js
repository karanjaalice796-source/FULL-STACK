//1. exercise 1 people
const people = ["Greg", "Mary", "Devon", "James"];

// --- Part I: Review about arrays ---

// 1. Remove "Greg" from the array
people.splice(people.indexOf("Greg"), 1);
console.log(people); // ["Mary", "Devon", "James"]

// 2. Replace "James" with "Jason"
people[people.indexOf("James")] = "Jason";
console.log(people); // ["Mary", "Devon", "Jason"]

// 3. Add your name to the end of the array
people.push("Claude");
console.log(people); // ["Mary", "Devon", "Jason", "Claude"]

// 4. Console.log Mary's index
console.log(people.indexOf("Mary")); // 0

// 5. Copy the array using slice, excluding "Mary" and your name
//    people is now ["Mary", "Devon", "Jason", "Claude"]
//    we want everything EXCEPT the first (Mary) and last (Claude) element
const peopleCopy = people.slice(1, -1);
console.log(peopleCopy); // ["Devon", "Jason"]

// 6. Index of "Foo"
console.log(people.indexOf("Foo")); // -1
// It returns -1 because "Foo" does not exist anywhere in the array,
// and indexOf() returns -1 whenever the searched value isn't found.

// 7. Variable "last" holding the last element of the array
const last = people[people.length - 1];
console.log(last); // "Claude"
// The last element's index is always (array.length - 1), since arrays
// are zero-indexed (the first element is at index 0, not 1).


// --- Part II: Loops ---

// 1. Iterate through the array and console.log each person
for (let i = 0; i < people.length; i++) {
  console.log(people[i]);
}

// 2. Iterate through the array, stop after logging "Devon"
for (let i = 0; i < people.length; i++) {
  console.log(people[i]);
  if (people[i] === "Devon") {
    break;
  }
}

//2. exercise 2 colors.
const colors = ["blue", "red", "green", "purple", "teal"];

// 2. Basic version: "My #1 choice is blue"
for (let i = 0; i < colors.length; i++) {
  console.log(`My #${i + 1} choice is ${colors[i]}`);
}

// 3. Bonus: "My 1st choice", "My 2nd choice", "My 3rd choice", "My 4th choice"...
const suffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];

for (let i = 0; i < colors.length; i++) {
  const rank = i + 1;
  // Special-case 11, 12, 13 which always use "th" (11th, 12th, 13th),
  // even though they end in 1, 2, 3.
  let suffix;
  if (rank % 100 >= 11 && rank % 100 <= 13) {
    suffix = "th";
  } else {
    suffix = suffixes[rank % 10];
  }
  console.log(`My ${rank}${suffix} choice is ${colors[i]}`);
}

//3. exercise 3 repeat question.
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askNumber() {
  rl.question("Enter a number: ", (answer) => {
    console.log(typeof answer); // "string" - just like prompt(), readline always gives a string

    const number = Number(answer);

    if (number < 10) {
      console.log("That number is too small, try again.");
      askNumber(); // ask again
    } else {
      console.log(`Thanks! You entered ${number}.`);
      rl.close();
    }
  });
}

askNumber();

//4. exercise 4 building.
const building = {
  numberOfFloors: 4,
  numberOfAptByFloor: {
    firstFloor: 3,
    secondFloor: 4,
    thirdFloor: 9,
    fourthFloor: 2,
  },
  nameOfTenants: ["Sarah", "Dan", "David"],
  numberOfRoomsAndRent: {
    sarah: [3, 990],
    dan: [4, 1000],
    david: [1, 500],
  },
};

// 2. Console.log the number of floors in the building
console.log(building.numberOfFloors); // 4

// 3. Console.log how many apartments are on floors 1 and 3
console.log(building.numberOfAptByFloor.firstFloor); // 3
console.log(building.numberOfAptByFloor.thirdFloor); // 9

// 4. Console.log the name of the second tenant and their number of rooms
const secondTenantName = building.nameOfTenants[1]; // "Dan"
const secondTenantRooms = building.numberOfRoomsAndRent.dan[0]; // 4
console.log(`${secondTenantName} has ${secondTenantRooms} rooms.`);

// 5. If Sarah's rent + David's rent > Dan's rent, raise Dan's rent to 1200
const sarahRent = building.numberOfRoomsAndRent.sarah[1]; 
const davidRent = building.numberOfRoomsAndRent.david[1]; 
const danRent = building.numberOfRoomsAndRent.dan[1];

if (sarahRent + davidRent > danRent) {
  building.numberOfRoomsAndRent.dan[1] = 1200;
}

console.log(building.numberOfRoomsAndRent.dan); 

//5. exercise 5 family.
const family = {
  father: "James",
  mother: "Linda",
  brother: "Tom",
  sister: "Anna",
};

// 2. Console.log the keys of the object
for (const key in family) {
  console.log(key);
}

// 3. Console.log the values of the object
for (const key in family) {
  console.log(family[key]);
}

//6. exercise 6 rudolf
const details = {
  my: "name",
  is: "Rudolf",
  the: "reindeer",
};

const keys = Object.keys(details);
let sentence = "";

for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  sentence += `${key} ${details[key]} `;
}

console.log(sentence.trim()); 

//7. exercise 7 secret group.
const names = ["Jack", "Philip", "Sarah", "Amanda", "Bernard", "Kyle"];

const firstLetters = names.map((name) => name[0]);
const sortedLetters = firstLetters.sort();
const secretSocietyName = sortedLetters.join("");

console.log(secretSocietyName); 