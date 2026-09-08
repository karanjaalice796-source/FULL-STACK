// Exercise 1 : Menu
const menu = [
	{ type: "starter", name: "Houmous with Pita" },
	{ type: "starter", name: "Vegetable Soup with Houmous peas" },
	{ type: "dessert", name: "Chocolate Cake" },
];

const hasDessert = menu.some(({ type }) => type === "dessert")
	? "The menu has a dessert."
	: "The menu has no dessert.";
console.log(hasDessert);

const areAllStarters = menu.every(({ type }) => type === "starter");
console.log(areAllStarters);

if (!menu.some(({ type }) => type === "main course")) {
	menu.push({ type: "main course", name: "Vegetable Lasagna" });
}
console.log(menu);

const vegetarian = ["vegetable", "houmous", "eggs", "vanilla", "potatoes"];
const menuWithVegetarianStatus = menu.map((course) => ({
	...course,
	vegetarian: vegetarian.some((ingredient) =>
		course.name.toLowerCase().includes(ingredient),
	),
}));
console.log(menuWithVegetarianStatus);

// Exercise 2 : Chop into chunks
function string_chop(string, chunkLength) {
	if (chunkLength <= 0) return [];

	const chunks = [];
	for (let index = 0; index < string.length; index += chunkLength) {
		chunks.push(string.slice(index, index + chunkLength));
	}
	return chunks;
}

console.log(string_chop("developers", 2)); 

// Exercise 3 : You said string?
function search_word(string, word) {
	const count = word === "" ? 0 : string.split(word).length - 1;
	return `'${word}' was found ${count} times.`;
}

console.log(search_word("The quick brown fox", "fox"));

// Exercise 4 : Reverse Array
function reverseArray(array) {
	for (let left = 0, right = array.length - 1; left < right; left++, right--) {
		[array[left], array[right]] = [array[right], array[left]];
	}
	return array;
}

console.log(reverseArray([1, 2, 3, 4, 5]));
console.log(reverseArray([1, 2]));
console.log(reverseArray([]));
console.log(reverseArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
