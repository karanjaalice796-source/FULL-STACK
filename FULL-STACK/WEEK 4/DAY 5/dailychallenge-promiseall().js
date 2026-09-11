const sunriseForm = document.querySelector("#sunriseForm");
const results = document.querySelector("#results");
const statusMessage = document.querySelector("#statusMessage");

function checkResponse(response) {
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response;
}

async function fetchSunrise(latitude, longitude) {
	const params = new URLSearchParams({
		lat: latitude,
		lng: longitude,
		formatted: "0"
	});
	const response = await fetch(`https://api.sunrise-sunset.org/json?${params}`);
	checkResponse(response);

	const result = await response.json();
	if (result.status !== "OK") {
		throw new Error("The sunrise API returned an invalid result.");
	}

	return result.results.sunrise;
}

sunriseForm.addEventListener("submit", async event => {
	event.preventDefault();
	statusMessage.textContent = "Loading sunrise times...";
	results.replaceChildren();

	const formData = new FormData(sunriseForm);
	const parisLatitude = formData.get("parisLatitude");
	const parisLongitude = formData.get("parisLongitude");
	const newYorkLatitude = formData.get("newYorkLatitude");
	const newYorkLongitude = formData.get("newYorkLongitude");

	try {
		const parisSunrise = fetchSunrise(parisLatitude, parisLongitude);
		const newYorkSunrise = fetchSunrise(newYorkLatitude, newYorkLongitude);
		const [parisTime, newYorkTime] = await Promise.all([
			parisSunrise,
			newYorkSunrise
		]);

		const parisResult = document.createElement("p");
		parisResult.textContent = `Paris sunrise: ${parisTime}`;
		const newYorkResult = document.createElement("p");
		newYorkResult.textContent = `New York sunrise: ${newYorkTime}`;
		results.append(parisResult, newYorkResult);
		statusMessage.textContent = "Both sunrise times loaded.";
	} catch (error) {
		statusMessage.textContent = `Unable to load sunrise times: ${error.message}`;
	}
});
