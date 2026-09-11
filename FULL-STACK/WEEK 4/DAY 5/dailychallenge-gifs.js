const giphyApiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
const gifForm = document.querySelector("#gifForm");
const categoryInput = document.querySelector("#category");
const gifsContainer = document.querySelector("#gifs");
const deleteAllButton = document.querySelector("#deleteAll");
const statusMessage = document.querySelector("#statusMessage");

function checkResponse(response) {
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response;
}

function appendGif(gif) {
	const gifElement = document.createElement("article");
	gifElement.className = "gif-item";

	const image = document.createElement("img");
	image.src = gif.images.fixed_height?.url || gif.images.original.url;
	image.alt = gif.title || "Random Giphy GIF";

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.textContent = "DELETE";
	deleteButton.addEventListener("click", () => gifElement.remove());

	gifElement.append(image, deleteButton);
	gifsContainer.appendChild(gifElement);
}

async function fetchRandomGif(category) {
	const params = new URLSearchParams({
		api_key: giphyApiKey,
		tag: category,
		rating: "g"
	});
	const response = await fetch(`https://api.giphy.com/v1/gifs/random?${params}`);
	checkResponse(response);

	const result = await response.json();
	if (!result.data?.images) {
		throw new Error("No GIF was found for that category.");
	}

	appendGif(result.data);
}

gifForm.addEventListener("submit", async event => {
	event.preventDefault();
	const category = categoryInput.value.trim();

	if (!category) {
		statusMessage.textContent = "Enter a category first.";
		categoryInput.focus();
		return;
	}

	statusMessage.textContent = "Loading...";

	try {
		await fetchRandomGif(category);
		statusMessage.textContent = "GIF added.";
		gifForm.reset();
		categoryInput.focus();
	} catch (error) {
		statusMessage.textContent = error.message;
	}
});

deleteAllButton.addEventListener("click", () => {
	gifsContainer.replaceChildren();
	statusMessage.textContent = "All GIFs deleted.";
});
