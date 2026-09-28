const express = require('express');

const app = express();
const greetingRouter = express.Router();
const PORT = process.env.PORT || 3000;
const emojis = ['😀', '🎉', '🌟', '🎈', '👋'];

app.use(express.urlencoded({ extended: false }));

greetingRouter.get('/', (req, res) => {
	res.type('html').send(renderPage());
});

greetingRouter.post('/greet', (req, res) => {
	const formData = req.body || {};
	const name = typeof formData.name === 'string' ? formData.name.trim() : '';
	const emoji = formData.emoji;

	if (!name) {
		return res.status(400).type('html').send(renderPage({
			name,
			emoji,
			error: 'Please enter your name to continue.'
		}));
	}
	if (name.length > 60) {
		return res.status(400).type('html').send(renderPage({
			name,
			emoji,
			error: 'Please keep your name under 60 characters.'
		}));
	}
	if (!emojis.includes(emoji)) {
		return res.status(400).type('html').send(renderPage({
			name,
			error: 'Choose one of the available emojis.'
		}));
	}

	res.type('html').send(renderPage({ name, emoji, greeted: true }));
});

app.use('/', greetingRouter);

app.use((req, res) => {
	res.status(404).type('html').send(renderPage({ error: 'That page could not be found.' }));
});

app.listen(PORT, () => {
	console.log(`Emoji greeting app running at http://localhost:${PORT}`);
});

function renderPage({ name = '', emoji = emojis[0], error = '', greeted = false } = {}) {
	const emojiOptions = emojis.map((choice) => `
				<label class="emoji-option">
					<input type="radio" name="emoji" value="${choice}" ${choice === emoji ? 'checked' : ''}>
					<span aria-hidden="true">${choice}</span>
					<span class="visually-hidden">Choose ${choice}</span>
				</label>`).join('');

	const content = greeted
		? `<section class="result" aria-live="polite">
				<p class="kicker">A note just for you</p>
				<h1>${emoji} Hello, ${escapeHtml(name)}!</h1>
				<p class="result-copy">Hope something good finds its way into your day.</p>
				<a class="again-link" href="/">Write another greeting <span aria-hidden="true">&#8594;</span></a>
			</section>`
		: `<section class="form-section">
				<p class="kicker">A little hello goes a long way</p>
				<h1>Make it<br><em>personal.</em></h1>
				<p class="intro">Add your name, pick a mood, and we’ll put together a greeting.</p>
				${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ''}
				<form action="/greet" method="post">
					<label class="name-label" for="name">Your name</label>
					<input id="name" name="name" type="text" maxlength="60" autocomplete="name" placeholder="Type your name" value="${escapeHtml(name)}" required>
					<fieldset>
						<legend>Choose your emoji</legend>
						<div class="emoji-picker">${emojiOptions}
						</div>
					</fieldset>
					<button type="submit">Send a greeting <span aria-hidden="true">&#8594;</span></button>
				</form>
			</section>`;

	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#f5eee4">
	<title>Emoji Greeting</title>
	<style>
		:root { color-scheme: light; font-family: "Trebuchet MS", "Segoe UI", sans-serif; color: #293c52; background: #f5eee4; font-synthesis: none; text-rendering: optimizeLegibility; --ink: #293c52; --muted: #68737c; --coral: #bd4e3c; --gold: #efc75e; --line: #d9d1c4; }
		* { box-sizing: border-box; }
		body { min-width: 320px; min-height: 100vh; margin: 0; padding: 24px; display: grid; place-items: center; background: radial-gradient(ellipse at 18% 14%, #fff9ec 0, transparent 35%), #f5eee4; }
		main { width: min(100%, 920px); min-height: 580px; display: grid; grid-template-columns: 1fr 0.8fr; background: #fffdf8; box-shadow: 12px 12px 0 #d8cabb; }
		.form-section, .result { align-self: center; padding: clamp(34px, 7vw, 72px); }
		.kicker { margin: 0 0 16px; color: var(--coral); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
		h1 { margin: 0; color: var(--ink); font: 400 clamp(48px, 6vw, 68px)/0.98 Georgia, "Times New Roman", serif; }
		h1 em { color: var(--coral); }
		.intro, .result-copy { max-width: 330px; margin: 20px 0 28px; color: var(--muted); font-size: 15px; line-height: 1.7; }
		form { display: grid; gap: 12px; }
		.name-label, legend { color: var(--ink); font-size: 12px; font-weight: 700; }
		input[type="text"] { width: 100%; min-height: 48px; padding: 0 13px; border: 1px solid var(--line); border-radius: 2px; background: #fff; color: var(--ink); font: inherit; }
		input[type="text"]:focus-visible, button:focus-visible, .emoji-option:focus-within { outline: 3px solid #5b8f89; outline-offset: 3px; }
		fieldset { margin: 8px 0 6px; padding: 0; border: 0; }
		legend { margin-bottom: 11px; }
		.emoji-picker { display: flex; flex-wrap: wrap; gap: 9px; }
		.emoji-option { position: relative; display: grid; width: 48px; aspect-ratio: 1; place-items: center; border: 1px solid var(--line); border-radius: 2px; background: #fff; cursor: pointer; font-size: 23px; transition: background 150ms ease, border-color 150ms ease; }
		.emoji-option:has(input:checked) { border-color: var(--ink); background: #f5e8c6; }
		.emoji-option input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
		button { min-height: 48px; margin-top: 8px; padding: 0 17px; display: inline-flex; align-items: center; justify-content: space-between; gap: 28px; border: 0; border-radius: 2px; background: var(--ink); color: #fffdf8; cursor: pointer; font: inherit; font-size: 14px; font-weight: 700; }
		button:hover { background: #3c536e; }
		main::after { content: ""; grid-column: 2; grid-row: 1; background-color: #e4e9df; background-image: linear-gradient(#293c520c 1px, transparent 1px), linear-gradient(90deg, #293c520c 1px, transparent 1px); background-size: 24px 24px; }
		.result { position: relative; z-index: 1; grid-column: 1 / -1; grid-row: 1; max-width: 690px; }
		.result h1 { font-size: clamp(44px, 6vw, 64px); line-height: 1.08; }
		.result-copy { margin-bottom: 32px; }
		.again-link { color: var(--ink); font-size: 14px; font-weight: 700; text-decoration-color: var(--coral); text-underline-offset: 5px; }
		.again-link span { margin-left: 10px; color: var(--coral); }
		.error { padding: 10px 12px; border-left: 3px solid var(--coral); background: #f8e7df; color: #8e3329; font-size: 13px; }
		.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; clip-path: inset(50%); }
		@media (max-width: 680px) { body { padding: 14px; } main { min-height: 0; grid-template-columns: 1fr; } .form-section, .result { padding: 36px 26px; } main::after { grid-column: 1; grid-row: 2; min-height: 115px; } .result { grid-row: 1 / span 2; } }
		@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0.01ms !important; } }
	</style>
</head>
<body>
	<main>${content}</main>
</body>
</html>`;
}

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[character]);
}
