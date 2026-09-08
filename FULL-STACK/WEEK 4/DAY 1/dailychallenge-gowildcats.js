const gameInfo = [
	{
		username: "john",
		team: "red",
		score: 5,
		items: ["ball", "book", "pen"],
	},
	{
		username: "becky",
		team: "blue",
		score: 10,
		items: ["tape", "backpack", "pen"],
	},
	{
		username: "susy",
		team: "red",
		score: 55,
		items: ["ball", "eraser", "pen"],
	},
	{
		username: "tyson",
		team: "green",
		score: 1,
		items: ["book", "pen"],
	},
];

const usernames = [];
gameInfo.forEach(({ username }) => usernames.push(`${username}!`));
console.log(usernames);

const winners = [];
gameInfo.forEach(({ username, score }) => {
	if (score > 5) winners.push(username);
});
console.log(winners);

const totalScore = gameInfo.reduce((total, { score }) => total + score, 0);
console.log(totalScore);
