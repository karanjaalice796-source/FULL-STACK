//Exercise1. divisible by three 
let numbers = [123, 8409, 100053, 333333333, 7];

for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i] % 3 === 0);
}

//Exercise2. attendance
const readline = require("readline");

let guestList = {
  randy: "Germany",
  karla: "France",
  wendy: "Japan",
  norman: "England",
  sam: "Argentina",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", (answer) => {
  const name = answer.trim().toLowerCase();

  if (name in guestList) {
    console.log(`Hi! I'm ${name}, and I'm from ${guestList[name]}.`);
  } else {
    console.log("Hi! I'm a guest.");
  }

  rl.close();
});

//Exercise3. playing with numbers
let age = [20, 5, 12, 43, 98, 55];

// 1. Sum of all numbers in the array
let sum = 0;
for (let i = 0; i < age.length; i++) {
  sum = sum + age[i];
}
console.log(sum); 

// 2. Highest age in the array
let highest = age[0];
for (let i = 1; i < age.length; i++) {
  if (age[i] > highest) {
    highest = age[i];
  }
}
console.log(highest); 