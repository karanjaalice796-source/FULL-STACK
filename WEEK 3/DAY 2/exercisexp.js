//Exercise1. divisible by 23 ·
function displayNumbersDivisible(divisor = 23) {
  let sum = 0;
  let output = "";

  for (let i = 0; i <= 500; i++) {
    if (i % divisor === 0) {
      output += i + " ";
      sum += i;
    }
  }

  console.log(output.trim());
  console.log("Sum: " + sum);
}

displayNumbersDivisible(); // uses the default divisor, 23
console.log("---");
displayNumbersDivisible(3);
console.log("---");
displayNumbersDivisible(45);

//Exercise2. shopping list
const stock = {
  banana: 6,
  apple: 0,
  pear: 12,
  orange: 32,
  blueberry: 1,
};

const prices = {
  banana: 4,
  apple: 2,
  pear: 1,
  orange: 1.5,
  blueberry: 10,
};

const shoppingList = ["banana", "orange", "apple"];

function myBill() {
  let total = 0;

  for (let i = 0; i < shoppingList.length; i++) {
    const item = shoppingList[i];

    if (item in stock) {
      total += prices[item];

      // Bonus: decrease stock by 1
      stock[item] = stock[item] - 1;
    }
  }

  return total;
}

console.log(myBill()); // 4 (banana) + 1.5 (orange) + 2 (apple) = 7.5
console.log(stock); // banana: 5, orange: 31, apple: -1 (already 0 in stock)

//Exercise3. change enough 
function changeEnough(itemPrice, amountOfChange) {
  const quarters = amountOfChange[0] * 0.25;
  const dimes = amountOfChange[1] * 0.1;
  const nickels = amountOfChange[2] * 0.05;
  const pennies = amountOfChange[3] * 0.01;

  const totalChange = quarters + dimes + nickels + pennies;

  return totalChange >= itemPrice;
}

console.log(changeEnough(4.25, [25, 20, 5, 0])); // true
console.log(changeEnough(14.11, [2, 100, 0, 0])); // false
console.log(changeEnough(0.75, [0, 0, 20, 5])); // true

//Exercise4. vacation costs
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function hotelCost(nights) {
  return nights * 140;
}

function planeRideCost(destination) {
  if (destination === "London") {
    return 183;
  } else if (destination === "Paris") {
    return 220;
  } else {
    return 300;
  }
}

function rentalCarCost(days) {
  let cost = days * 40;
  if (days > 10) {
    cost = cost - cost * 0.05;
  }
  return cost;
}

async function totalVacationCost() {
  let nightsInput;
  do {
    nightsInput = await askQuestion("How many nights will you stay at the hotel? ");
  } while (nightsInput === "" || isNaN(nightsInput));
  const nights = Number(nightsInput);

  let destination;
  do {
    destination = await askQuestion("What is your destination? ");
  } while (destination === "" || !isNaN(destination));

  let daysInput;
  do {
    daysInput = await askQuestion("How many days will you rent the car? ");
  } while (daysInput === "" || isNaN(daysInput));
  const days = Number(daysInput);

  const hotel = hotelCost(nights);
  const plane = planeRideCost(destination);
  const car = rentalCarCost(days);
  const total = hotel + plane + car;

  console.log(
    `The car cost: $${car}, the hotel cost: $${hotel}, the plane tickets cost: $${plane}.`
  );
  console.log(`Total vacation cost: $${total}`);

  rl.close();
  return total;
}

totalVacationCost();

//
const myName = "Alice"; 
// --- Part 1 ---

// Retrieve the div and console.log it
const container = document.getElementById("container");
console.log(container);

// Grab both <ul> elements
const lists = document.querySelectorAll("ul.list");
const firstList = lists[0];
const secondList = lists[1];

// Change "Pete" to "Richard"
// Pete is the second <li> of the first <ul>
firstList.children[1].textContent = "Richard";

// Delete the second <li> of the second <ul> (that's "Sarah")
secondList.removeChild(secondList.children[1]);

// Change the first <li> of each <ul> to your name, using a loop
for (let i = 0; i < lists.length; i++) {
  lists[i].children[0].textContent = myName;
}

// --- Part 2 ---

// Add class "student_list" to both <ul>'s
for (let i = 0; i < lists.length; i++) {
  lists[i].classList.add("student_list");
}

// Add classes "university" and "attendance" to the first <ul>
firstList.classList.add("university");
firstList.classList.add("attendance");

// --- Part 3 ---

// Add a light blue background color and some padding to the <div>
container.style.backgroundColor = "lightblue";
container.style.padding = "10px";
secondList.children[1].style.display = "none";
firstList.children[1].style.border = "1px solid black";
document.b/ody.style.fontSize; "18px";
if (container.style.backgroundColor === "lightblue") {
  const firstListNames = firstList.children[0].textContent + " and " + firstList.children[1].textContent;
  alert(`Hello ${firstListNames}`);
}