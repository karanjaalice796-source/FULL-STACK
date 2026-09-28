let currentEmojiId = null;
let score = 0;
let hasAnswered = false;
let nextQuestionTimer = null;

const emojiDisplay = document.getElementById('emoji-display');
const optionsContainer = document.getElementById('options-container');
const scoreSpan = document.getElementById('score');
const feedbackP = document.getElementById('feedback');
const leaderboardList = document.getElementById('leaderboard-list');
const restartButton = document.getElementById('restart-button');
const gameOverForm = document.getElementById('game-over-form');
const playerNameInput = document.getElementById('player-name');

function setFeedback(message, state = '') {
    feedbackP.textContent = message;
    feedbackP.className = `feedback ${state}`;
}

async function fetchNewQuestion() {
    clearTimeout(nextQuestionTimer);
    nextQuestionTimer = null;
    setFeedback('Loading the next emoji...');
    optionsContainer.innerHTML = '';
    hasAnswered = false;
    gameOverForm.hidden = true;
    
    try {
        const response = await fetch('/api/game/question');
        if (!response.ok) throw new Error(`Question request failed: ${response.status}`);
        const data = await response.json();
        
        currentEmojiId = data.id;
        emojiDisplay.textContent = data.emoji;
        emojiDisplay.setAttribute('aria-label', `Emoji clue: ${data.emoji}`);
        setFeedback('');

        data.options.forEach(option => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.type = 'button';
            btn.textContent = option;
            btn.addEventListener('click', () => submitGuess(option));
            optionsContainer.appendChild(btn);
        });
    } catch (err) {
        console.error('Failed to load question', err);
        emojiDisplay.textContent = '⚠️';
        setFeedback('Could not load a question. Check the connection and try New game.', 'error');
    }
}

async function submitGuess(selectedGuess) {
    if (hasAnswered) return;
    hasAnswered = true;
    optionsContainer.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });
    setFeedback('Checking your answer...');

    try {
        const response = await fetch('/api/game/guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentEmojiId, guess: selectedGuess })
        });
        if (!response.ok) throw new Error(`Guess request failed: ${response.status}`);
        const result = await response.json();

        if (result.correct) {
            score += 1;
            scoreSpan.textContent = score;
            setFeedback('🎉 Correct! Next emoji coming up...', 'success');
            nextQuestionTimer = setTimeout(fetchNewQuestion, 1200);
        } else {
            setFeedback(`❌ The answer was ${result.correctName}. Your score: ${score}.`, 'error');
            gameOverForm.hidden = false;
            playerNameInput.focus();
        }
    } catch (err) {
        console.error('Error submitting guess', err);
        hasAnswered = false;
        optionsContainer.querySelectorAll('button').forEach(button => {
            button.disabled = false;
        });
        setFeedback('Could not check that answer. Please try again.', 'error');
    }
}

async function saveScore(event) {
    event.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        playerNameInput.focus();
        return;
    }

    const submitButton = gameOverForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setFeedback('Saving your score...');

    try {
        const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score })
        });
        if (!response.ok) throw new Error(`Score request failed: ${response.status}`);
        await fetchLeaderboard();
        gameOverForm.hidden = true;
        restartButton.textContent = 'Play again';
        setFeedback('Score saved. Start another round whenever you are ready.', 'success');
        restartButton.focus();
    } catch (err) {
        console.error('Failed to save score', err);
        setFeedback('Could not save your score. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
    }

}

function startNewGame() {
    score = 0;
    scoreSpan.textContent = score;
    playerNameInput.value = '';
    restartButton.textContent = 'New game';
    fetchNewQuestion();
}

async function fetchLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) throw new Error(`Leaderboard request failed: ${response.status}`);
        const leaders = await response.json();
        
        leaderboardList.innerHTML = '';
        leaders.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}: ${entry.score} pts`;
            leaderboardList.appendChild(li);
        });
    } catch (err) {
        console.error('Failed to fetch leaderboard', err);
        leaderboardList.innerHTML = '<li>Leaderboard unavailable</li>';
    }
}

restartButton.addEventListener('click', startNewGame);
gameOverForm.addEventListener('submit', saveScore);

fetchNewQuestion();
fetchLeaderboard();