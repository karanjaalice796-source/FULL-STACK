function makeAllCaps(words) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(words) || !words.every((word) => typeof word === "string")) {
			reject("All items must be strings.");
			return;
		}

		resolve(words.map((word) => word.toUpperCase()));
	});
}

function sortWords(words) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(words) || words.length <= 4) {
			reject("The array must contain more than four words.");
			return;
		}

		resolve([...words].sort((firstWord, secondWord) => firstWord.localeCompare(secondWord)));
	});
}

const morse = `{
	"0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
	"5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
	"a": ".-", "b": "-...", "c": "-.-.", "d": "-..", "e": ".", "f": "..-.",
	"g": "--.", "h": "....", "i": "..", "j": ".---", "k": "-.-", "l": ".-..",
	"m": "--", "n": "-.", "o": "---", "p": ".--.", "q": "--.-", "r": ".-.",
	"s": "...", "t": "-", "u": "..-", "v": "...-", "w": ".--", "x": "-..-",
	"y": "-.--", "z": "--..", ".": ".-.-.-", ",": "--..--", "?": "..--..",
	"!": "-.-.--", "-": "-....-", "/": "-..-.", "@": ".--.-.", "(": "-.--.",
	")": "-.--.-"
}`;

function toJs() {
	return new Promise((resolve, reject) => {
		try {
			const morseJS = JSON.parse(morse);

			if (Object.keys(morseJS).length === 0) {
				reject("The Morse object is empty.");
				return;
			}

			resolve(morseJS);
		} catch (error) {
			reject(error);
		}
	});
}

function toMorse(morseJS, input) {
	return new Promise((resolve, reject) => {
		const wordOrSentence = input ?? (
			typeof prompt === "function" ? prompt("Enter a word or sentence:") : undefined
		);

		if (typeof wordOrSentence !== "string") {
			reject("A word or sentence is required.");
			return;
		}

		const characters = wordOrSentence.toLowerCase().split("");
		const unsupportedCharacter = characters.find((character) => !morseJS[character]);

		if (unsupportedCharacter) {
			reject(`The character "${unsupportedCharacter}" is not in the Morse object.`);
			return;
		}

		resolve(characters.map((character) => morseJS[character]));
	});
}

function joinWords(morseTranslation) {
	const joinedTranslation = morseTranslation.join("\n");

	if (typeof document !== "undefined") {
		const output = document.createElement("pre");
		output.textContent = joinedTranslation;
		document.body.appendChild(output);
	}

	return joinedTranslation;
}

function runMorseTranslator(input) {
	return toJs()
		.then((morseJS) => toMorse(morseJS, input))
		.then(joinWords);
}

module.exports = {
	makeAllCaps,
	sortWords,
	toJs,
	toMorse,
	joinWords,
	runMorseTranslator,
};
