// Exercise 1 : Sum elements
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, number) => total + number, 0);
console.log(sum);

// Exercise 2 : Remove duplicates
const values = [1, 2, 2, 3, 4, 4, 5];
const uniqueValues = [...new Set(values)];
console.log(uniqueValues); 

// Exercise 3 : Remove certain values
const sampleArray = [NaN, 0, 15, false, -22, "", undefined, 47, null];
const filteredArray = sampleArray.filter(Boolean);
console.log(filteredArray);

// Exercise 4 : Repeat please!
function repeat(string, times = 1) {
	return string.repeat(times);
}

console.log(repeat("Ha!", 3));

// Exercise 5 : Turtle & Rabbit
const startLine = "     ||<- Start line";
let turtle = "🐢";
const rabbit = "🐇";

turtle = turtle.padStart(8, " ");
const linedUpRabbit = rabbit.padStart(8, " ");

console.log(startLine);
console.log(turtle);
console.log(linedUpRabbit);

turtle = turtle.trim().padEnd(9, "=");
console.log(turtle); 