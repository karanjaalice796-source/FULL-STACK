const giphyApiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";

function checkResponse(response) {
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response;
}

async function fetchGiphyResults() {
	const url = `https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=${giphyApiKey}`;
	const response = await fetch(url);
	checkResponse(response);
	const gifs = await response.json();

	console.log("Exercise 1:", gifs);
}

async function fetchSunGifs() {
	const url = `https://api.giphy.com/v1/gifs/search?q=sun&rating=g&limit=10&offset=2&api_key=${giphyApiKey}`;
	const response = await fetch(url);
	checkResponse(response);
	const gifs = await response.json();

	console.log("Exercise 2:", gifs);
}

async function fetchStarship() {
	const response = await fetch("https://www.swapi.tech/api/starships/9/");
	checkResponse(response);
	const objectStarWars = await response.json();

	console.log("Exercise 3:", objectStarWars.result);
}

function resolveAfter2Seconds() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("resolved");
		}, 2000);
	});
}

async function asyncCall() {
	console.log("calling");
	const result = await resolveAfter2Seconds();
	console.log(result);
}

async function runExercises() {
	try {
		await fetchGiphyResults();
		await fetchSunGifs();
		await fetchStarship();
		await asyncCall();
	} catch (error) {
		console.error("An error occurred:", error.message);
	}
}

runExercises();
