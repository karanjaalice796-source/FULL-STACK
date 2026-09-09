const quotes = [
	{
		id: 0,
		author: "Kjayy Noble",
		quote: "You can't use up creativity. The more you use, the more you have.",
		likes: 0,
	},
	{
		id: 1,
		author: "Oscar Wilde",
		quote: "Be yourself; everyone else is already taken.",
		likes: 0,
	},
	{
		id: 2,
		author: "James Clear",
		quote: "Every action you take is a vote for the person you wish to become.",
		likes: 0,
	},
	{
		id: 3,
		author: "Audre Lorde",
		quote: "When I dare to be powerful, I use my strength in the service of my vision.",
		likes: 0,
	},
];

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteMeta = document.querySelector("#quote-meta");
const status = document.querySelector("#status");
const authorFilter = document.querySelector("#author-filter");

let displayedQuote = null;
let filteredQuotes = [];
let filteredIndex = 0;

function renderQuote(quote) {
	displayedQuote = quote;
	quoteText.textContent = `“${quote.quote}”`;
	quoteAuthor.textContent = `— ${quote.author}`;
	quoteMeta.textContent = `Quote #${quote.id} · Likes: ${quote.likes}`;
}

function generateQuote() {
	const availableQuotes = quotes.filter((quote) => quote !== displayedQuote);
	const randomIndex = Math.floor(Math.random() * availableQuotes.length);
	renderQuote(availableQuotes[randomIndex]);
	status.textContent = "A new quote has arrived.";
}

function updateAuthorOptions() {
	const authors = [...new Set(quotes.map((quote) => quote.author))].sort();
	authorFilter.replaceChildren(new Option("All authors", ""));
	authors.forEach((author) => authorFilter.add(new Option(author, author)));
}

function showFilteredQuote() {
	if (filteredQuotes.length === 0) {
		quoteText.textContent = "No quotes found for this author.";
		quoteAuthor.textContent = "";
		quoteMeta.textContent = "";
		return;
	}

	renderQuote(filteredQuotes[filteredIndex]);
	status.textContent = `Quote ${filteredIndex + 1} of ${filteredQuotes.length}`;
}

document.querySelector("#generate-button").addEventListener("click", generateQuote);

document.querySelector("#like-button").addEventListener("click", () => {
	if (!displayedQuote) return;
	displayedQuote.likes += 1;
	renderQuote(displayedQuote);
	status.textContent = "Quote liked.";
});

document.querySelector("#characters-button").addEventListener("click", () => {
	if (displayedQuote) status.textContent = `Characters including spaces: ${displayedQuote.quote.length}`;
});

document.querySelector("#characters-no-spaces-button").addEventListener("click", () => {
	if (displayedQuote) status.textContent = `Characters excluding spaces: ${displayedQuote.quote.replace(/\s/g, "").length}`;
});

document.querySelector("#words-button").addEventListener("click", () => {
	if (displayedQuote) status.textContent = `Words: ${displayedQuote.quote.trim().split(/\s+/).length}`;
});

document.querySelector("#add-quote-form").addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);
	const newQuote = {
		id: quotes.length,
		author: formData.get("author").trim(),
		quote: formData.get("quote").trim(),
		likes: 0,
	};
	quotes.push(newQuote);
	updateAuthorOptions();
	event.currentTarget.reset();
	status.textContent = `Quote #${newQuote.id} added.`;
});

document.querySelector("#filter-form").addEventListener("submit", (event) => {
	event.preventDefault();
	const author = authorFilter.value;
	filteredQuotes = author ? quotes.filter((quote) => quote.author === author) : [...quotes];
	filteredIndex = 0;
	showFilteredQuote();
});

document.querySelector("#previous-button").addEventListener("click", () => {
	if (!filteredQuotes.length) return;
	filteredIndex = (filteredIndex - 1 + filteredQuotes.length) % filteredQuotes.length;
	showFilteredQuote();
});

document.querySelector("#next-button").addEventListener("click", () => {
	if (!filteredQuotes.length) return;
	filteredIndex = (filteredIndex + 1) % filteredQuotes.length;
	showFilteredQuote();
});

updateAuthorOptions();