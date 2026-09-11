function checkResponse(response) {
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response;
}

// Exercise 1: display the GIF selected by the user.
async function fetchRandomGif() {
	try {
		const image = document.createElement("img");
		image.src = "https://media.giphy.com/media/kcLbvOarYaueVOl29E/giphy.gif";
		image.alt = "Football laughing reaction GIF";
		document.querySelector("#gif").appendChild(image);
	} catch (error) {
		console.error("Unable to fetch the GIF:", error.message);
	}
}

fetchRandomGif();

// Exercise 2: the slow promise finishes before the fast promise starts.
const resolveAfter2Seconds = function () {
	console.log("starting slow promise");
	return new Promise(resolve => {
		setTimeout(function () {
			resolve("slow");
			console.log("slow promise is done");
		}, 2000);
	});
};

const resolveAfter1Second = function () {
	console.log("starting fast promise");
	return new Promise(resolve => {
		setTimeout(function () {
			resolve("fast");
			console.log("fast promise is done");
		}, 1000);
	});
};

const sequentialStart = async function () {
	console.log("==SEQUENTIAL START==");
	const slow = await resolveAfter2Seconds();
	console.log(slow);
	const fast = await resolveAfter1Second();
	console.log(fast);
};

sequentialStart();

// Exercise 3: both promises start immediately and run concurrently.
const concurrentStart = async function () {
	console.log("==CONCURRENT START with await==");
	const slow = resolveAfter2Seconds();
	const fast = resolveAfter1Second();
	console.log(await slow);
	console.log(await fast);
};

setTimeout(concurrentStart, 4000);

// Exercise 4: fetch all resources with async/await and handle a failed request.
const urls = [
	"https://jsonplaceholder.typicode.com/users",
	"https://jsonplaceholder.typicode.com/invalid-posts",
	"https://jsonplaceholder.typicode.com/albums"
];

const getData = async function () {
	try {
		const responses = await Promise.all(urls.map(async url => {
			const response = await fetch(url);
			checkResponse(response);
			return response;
		}));
		const [usersResponse, postsResponse, albumsResponse] = responses;

		const users = await usersResponse.json();
		const posts = await postsResponse.json();
		const albums = await albumsResponse.json();

		console.log("users", users);
		console.log("posts", posts);
		console.log("albums", albums);
	} catch (error) {
		console.log("ooooooops");
	}
};

getData();
