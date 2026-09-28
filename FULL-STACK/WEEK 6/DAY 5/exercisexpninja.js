const express = require('express');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const app = express();
const PORT = process.env.PORT || 3002;
const questions = [
	{
		id: 'node-runtime',
		prompt: 'What does Node.js use to execute JavaScript outside the browser?',
		options: ['SpiderMonkey', 'V8', 'Java Virtual Machine', 'WebKit'],
		correctIndex: 1
	},
	{
		id: 'express-purpose',
		prompt: 'What is Express primarily used for in a Node.js project?',
		options: ['Building web servers and APIs', 'Editing images', 'Managing CSS animations', 'Compiling TypeScript'],
		correctIndex: 0
	},
	{
		id: 'http-get',
		prompt: 'Which HTTP method is commonly used to retrieve data?',
		options: ['POST', 'PATCH', 'GET', 'DELETE'],
		correctIndex: 2
	},
	{
		id: 'module-export',
		prompt: 'In CommonJS, which value is used to expose functionality from a module?',
		options: ['module.exports', 'document.exports', 'app.public', 'global.import'],
		correctIndex: 0
	},
	{
		id: 'json-middleware',
		prompt: 'What does express.json() middleware do?',
		options: ['Compresses images', 'Parses incoming JSON request bodies', 'Creates database tables', 'Validates passwords'],
		correctIndex: 1
	},
	{
		id: 'status-created',
		prompt: 'Which HTTP status code usually indicates a resource was created?',
		options: ['200', '201', '301', '404'],
		correctIndex: 1
	}
];
const quizSessions = new Map();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'exercisexpninja.html'));
});

app.get('/api/quiz/start', (req, res) => {
	const sessionId = randomUUID();
	quizSessions.set(sessionId, { questionIndex: 0, score: 0 });

	res.status(201).json({
		sessionId,
		question: toPublicQuestion(questions[0], 1),
		totalQuestions: questions.length
	});
});

app.post('/api/quiz/answer', (req, res) => {
	const { sessionId, questionId, answerIndex } = req.body;
	const session = quizSessions.get(sessionId);

	if (!session) {
		return res.status(404).json({ error: 'Quiz session not found. Start a new quiz.' });
	}

	const question = questions[session.questionIndex];
	if (!question) {
		return res.status(409).json({ error: 'This quiz is already complete.' });
	}
	if (questionId !== question.id) {
		return res.status(409).json({ error: 'That question has already been answered or is out of date.' });
	}
	if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= question.options.length) {
		return res.status(400).json({ error: 'Select a valid answer.' });
	}

	const correct = answerIndex === question.correctIndex;
	if (correct) session.score += 1;
	session.questionIndex += 1;

	const completed = session.questionIndex === questions.length;
	res.json({
		correct,
		correctIndex: question.correctIndex,
		feedback: correct ? 'Correct. Nicely done.' : 'Not quite. The correct answer is highlighted.',
		score: session.score,
		completed,
		totalQuestions: questions.length,
		nextQuestion: completed ? null : toPublicQuestion(questions[session.questionIndex], session.questionIndex + 1)
	});
});

app.listen(PORT, () => {
	console.log(`Node.js quiz running at http://localhost:${PORT}`);
});

function toPublicQuestion(question, questionNumber) {
	return {
		id: question.id,
		prompt: question.prompt,
		options: question.options,
		questionNumber
	};
}
