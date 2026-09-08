// Ex1 : Analyzing the map method
const doubledNumbers = [1, 2, 3].map((num) => {
	if (typeof num === "number") return num * 2;
	return;
});
console.log(doubledNumbers);

// Ex2 : Analyzing the reduce method
const reducedNumbers = [[0, 1], [2, 3]].reduce(
	(acc, cur) => acc.concat(cur),
	[1, 2],
);
console.log(reducedNumbers);

// Ex3 : Analyze this code
const arrayNum = [1, 2, 4, 5, 8, 9];
const newArray = arrayNum.map((num, i) => {
	console.log(num, i);
	return num * 2;
});
console.log(newArray);

// Ex4 : Nested arrays
const array = [[1], [2], [3], [[[4]]], [[[5]]]];
const flattenedArray = array.flat(2);
console.log(flattenedArray); 

const greeting = [
	["Hello", "young", "grasshopper!"],
	["you", "are"],
	["learning", "fast!"],
];
const joinedGreeting = greeting.map((words) => words.join(" "));
console.log(joinedGreeting);

const greetingString = joinedGreeting.join(" ");
console.log(greetingString);

const trapped = [[[[[[[[[[[[[[[[[[[[[[[[[[3]]]]]]]]]]]]]]]]]]]]]]]]]];
const releasedNumber = trapped.flat(Infinity);
console.log(releasedNumber); 
