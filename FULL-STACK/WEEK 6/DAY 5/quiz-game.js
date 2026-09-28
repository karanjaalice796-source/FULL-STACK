const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startButton = document.getElementById('start-button');
const startError = document.getElementById('start-error');
const questionCount = document.getElementById('question-count');
const progress = document.getElementById('quiz-progress');
const questionPrompt = document.getElementById('question-prompt');
const answerForm = document.getElementById('answer-form');
const answerOptions = document.getElementById('answer-options');
const answerFeedback = document.getElementById('answer-feedback');
const submitButton = document.getElementById('submit-button');
const nextButton = document.getElementById('next-button');
const scoreValue = document.getElementById('score-value');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const restartButton = document.getElementById('restart-button');

let sessionId = null;
let currentQuestion = null;
let totalQuestions = 0;
let nextQuestion = null;
let currentScore = 0;

async function startQuiz() {
    startButton.disabled = true;
    startError.hidden = true;

    try {
        const response = await fetch('/api/quiz/start');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to start the quiz.');

        sessionId = data.sessionId;
        totalQuestions = data.totalQuestions;
        currentScore = 0;
        scoreValue.textContent = currentScore;
        progress.max = totalQuestions;
        welcomeScreen.hidden = true;
        resultsScreen.hidden = true;
        quizScreen.hidden = false;
        renderQuestion(data.question);
    } catch (error) {
        startError.textContent = error.message;
        startError.hidden = false;
    } finally {
        startButton.disabled = false;
    }
}

function renderQuestion(question) {
    currentQuestion = question;
    nextQuestion = null;
    questionCount.textContent = `QUESTION ${String(question.questionNumber).padStart(2, '0')} / ${String(totalQuestions).padStart(2, '0')}`;
    progress.value = question.questionNumber;
    questionPrompt.textContent = question.prompt;
    answerFeedback.textContent = '';
    answerFeedback.className = 'answer-feedback';
    answerOptions.replaceChildren();

    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'answer-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = index;
        input.addEventListener('change', () => {
            submitButton.disabled = false;
        });

        const text = document.createElement('span');
        text.textContent = option;
        label.append(input, text);
        answerOptions.appendChild(label);
    });

    submitButton.hidden = false;
    submitButton.disabled = true;
    nextButton.hidden = true;
    answerOptions.querySelector('input')?.focus();
}

async function submitAnswer(event) {
    event.preventDefault();
    const selected = answerOptions.querySelector('input:checked');
    if (!selected || !currentQuestion) return;

    submitButton.disabled = true;
    answerOptions.querySelectorAll('input').forEach((input) => {
        input.disabled = true;
    });

    try {
        const response = await fetch('/api/quiz/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                questionId: currentQuestion.id,
                answerIndex: Number(selected.value)
            })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to check your answer.');

        currentScore = result.score;
        scoreValue.textContent = currentScore;
        answerOptions.querySelectorAll('.answer-option').forEach((label, index) => {
            label.classList.add('is-locked');
            if (index === result.correctIndex) label.classList.add('is-correct');
            if (index === Number(selected.value) && !result.correct) label.classList.add('is-incorrect');
        });
        answerFeedback.textContent = result.correct
            ? 'Correct. Nicely done.'
            : `Not quite. The answer was ${currentQuestion.options[result.correctIndex]}.`;
        answerFeedback.classList.add(result.correct ? 'success' : 'error');

        nextQuestion = result.nextQuestion;
        submitButton.hidden = true;
        nextButton.hidden = false;
        nextButton.textContent = result.completed ? 'See results' : 'Next question';
        nextButton.focus();
    } catch (error) {
        answerFeedback.textContent = error.message;
        answerFeedback.className = 'answer-feedback error';
        answerOptions.querySelectorAll('input').forEach((input) => {
            input.disabled = false;
        });
        submitButton.disabled = false;
    }
}

function advanceQuiz() {
    if (nextQuestion) {
        renderQuestion(nextQuestion);
        return;
    }

    quizScreen.hidden = true;
    resultsScreen.hidden = false;
    finalScore.textContent = currentScore;
    resultMessage.textContent = getResultMessage(currentScore, totalQuestions);
    restartButton.focus();
}

function getResultMessage(score, total) {
    if (score === total) return 'Perfect round. You know your Node.js fundamentals.';
    if (score >= Math.ceil(total * 0.7)) return 'Strong result. Your fundamentals are in good shape.';
    return 'Good start. There is always another round.';
}

startButton.addEventListener('click', startQuiz);
answerForm.addEventListener('submit', submitAnswer);
nextButton.addEventListener('click', advanceQuiz);
restartButton.addEventListener('click', startQuiz);