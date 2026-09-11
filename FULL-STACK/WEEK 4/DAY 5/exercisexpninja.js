const giphyApiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
const gifForm = document.querySelector("#gifForm");
const categoryInput = document.querySelector("#category");
const gifsContainer = document.querySelector("#gifs");
const statusMessage = document.querySelector("#statusMessage");

function checkResponse(response) {
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response;
}

function appendGif(gif) {
	const image = document.createElement("img");
	image.src = gif.images.fixed_height.url;
	image.alt = gif.title || "Giphy result";
	gifsContainer.appendChild(image);
}

async function fetchGifs(category) {
	const params = new URLSearchParams({
		api_key: giphyApiKey,
		q: category,
		rating: "g",
		limit: "10"
	});
	const response = await fetch(`https://api.giphy.com/v1/gifs/search?${params}`);
	checkResponse(response);

	const result = await response.json();
	result.data.forEach(appendGif);
}

gifForm.addEventListener("submit", async event => {
	event.preventDefault();
	const category = categoryInput.value.trim();

	if (!category) {
		statusMessage.textContent = "Enter a category first.";
		return;
	}

	statusMessage.textContent = "Loading...";

	try {
		await fetchGifs(category);
		statusMessage.textContent = "GIFs added.";
		gifForm.reset();
	} catch (error) {
		statusMessage.textContent = `Unable to fetch GIFs: ${error.message}`;
	}
});

document.querySelector("#deleteAll").addEventListener("click", () => {
	gifsContainer.replaceChildren();
	statusMessage.textContent = "All GIFs deleted.";
});

function resolveAfter2Seconds() {
	console.log("starting slow promise");
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("slow");
			console.log("slow promise is done");
		}, 2000);
	});
}

function resolveAfter1Second() {
	console.log("starting fast promise");
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("fast");
			console.log("fast promise is done");
		}, 1000);
	});
}

// Exercise 2: both promises start after one second; Promise.all logs in input order.
function concurrentPromise() {
	console.log("==CONCURRENT START with Promise.all==");
	Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(messages => {
		console.log(messages[0]);
		console.log(messages[1]);
	});
}

setTimeout(concurrentPromise, 1000);

// Exercise 3: both async jobs start together and wait for Promise.all.
async function parallel() {
	console.log("==PARALLEL with await Promise.all==");
	await Promise.all([
		(async () => console.log(await resolveAfter2Seconds()))(),
		(async () => console.log(await resolveAfter1Second()))()
	]);
}

setTimeout(parallel, 5000);

// Exercise 4: each promise handles its result independently with then().
function parallelPromise() {
	console.log("==PARALLEL with Promise.then==");
	resolveAfter2Seconds().then(message => console.log(message));
	resolveAfter1Second().then(message => console.log(message));
}

setTimeout(parallelPromise, 13000);
