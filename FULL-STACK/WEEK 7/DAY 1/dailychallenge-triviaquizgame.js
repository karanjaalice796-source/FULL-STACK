const express = require('express');
const { randomUUID } = require('node:crypto');

const app = express();
const quizRouter = express.Router();
const PORT = process.env.PORT || 3001;

const triviaQuestions = [
	{
		question: 'What is the capital of France?',
		answer: 'Paris'
	},
	{
		question: 'Which planet is known as the Red Planet?',
		answer: 'Mars'
	},
	{
		question: 'What is the largest mammal in the world?',
		answer: 'Blue whale'
	}
];

const quizSessions = new Map();

app.use(express.json());

quizRouter.get('/', (req, res) => {
	const sessionId = randomUUID();
	quizSessions.set(sessionId, { currentQuestion: 0, score: 0, finished: false });

	res.status(201).json({
		sessionId,
		questionNumber: 1,
		totalQuestions: triviaQuestions.length,
		question: triviaQuestions[0].question
	});
});

quizRouter.post('/', (req, res) => {
	const { sessionId, answer } = req.body;
	const session = quizSessions.get(sessionId);

	if (!session) {
		return res.status(404).json({ error: 'Quiz session not found. Start a new quiz with GET /quiz.' });
	}
	if (session.finished) {
		return res.status(409).json({ error: 'This quiz is already complete.', score: session.score });
	}
	if (typeof answer !== 'string' || !answer.trim()) {
		return res.status(400).json({ error: 'A non-empty answer is required.' });
	}

	const currentQuestion = triviaQuestions[session.currentQuestion];
	const isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
	if (isCorrect) session.score += 1;
	session.currentQuestion += 1;

	const feedback = isCorrect
		? 'Correct!'
		: `Incorrect. The correct answer is ${currentQuestion.answer}.`;

	if (session.currentQuestion === triviaQuestions.length) {
		session.finished = true;
		return res.json({
			correct: isCorrect,
			feedback,
			completed: true,
			score: session.score,
			totalQuestions: triviaQuestions.length
		});
	}

	res.json({
		correct: isCorrect,
		feedback,
		completed: false,
		score: session.score,
		questionNumber: session.currentQuestion + 1,
		question: triviaQuestions[session.currentQuestion].question
	});
});

quizRouter.get('/score', (req, res) => {
	const session = quizSessions.get(req.query.sessionId);

	if (!session) {
		return res.status(404).json({ error: 'Quiz session not found. Start a new quiz with GET /quiz.' });
	}
	if (!session.finished) {
		return res.status(409).json({ error: 'Answer all quiz questions before requesting your final score.' });
	}

	res.json({
		score: session.score,
		totalQuestions: triviaQuestions.length,
		message: `You scored ${session.score} out of ${triviaQuestions.length}.`
	});
});

app.use('/quiz', quizRouter);

app.listen(PORT, () => {
	console.log(`Trivia quiz server running at http://localhost:${PORT}`);
});
