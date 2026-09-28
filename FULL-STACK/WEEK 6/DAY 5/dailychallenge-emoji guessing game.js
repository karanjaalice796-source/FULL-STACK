let currentEmojiId = null;
let score = 0;
let hasAnswered = false;

const emojiDisplay = document.getElementById('emoji-display');
const optionsContainer = document.getElementById('options-container');
const scoreSpan = document.getElementById('score');
const feedbackP = document.getElementById('feedback');
const leaderboardList = document.getElementById('leaderboard-list');

async function fetchNewQuestion() {
    feedbackP.textContent = '';
    optionsContainer.innerHTML = '';
    hasAnswered = false;
    
    try {
        const response = await fetch('/api/game/question');
        const data = await response.json();
        
        currentEmojiId = data.id;
        emojiDisplay.textContent = data.emoji;
        emojiDisplay.setAttribute('aria-label', `Emoji clue: ${data.emoji}`);

        data.options.forEach(option => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.textContent = option;
            btn.addEventListener('click', () => submitGuess(option));
            optionsContainer.appendChild(btn);
        });
    } catch (err) {
        console.error('Failed to load question', err);
        emojiDisplay.textContent = '⚠️';
        feedbackP.textContent = 'Could not load the emoji. Start the Express server and open http://localhost:3000.';
    }
}

async function submitGuess(selectedGuess) {
    if (hasAnswered) return;

    try {
        const response = await fetch('/api/game/guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentEmojiId, guess: selectedGuess })
        });
        
        const result = await response.json();
        hasAnswered = true;

        // Disable buttons after selection
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);

        if (result.correct) {
            score += 1;
            scoreSpan.textContent = score;
            feedbackP.textContent = '🎉 Correct!';
            feedbackP.style.color = 'green';
        } else {
            feedbackP.textContent = `❌ Wrong! It was ${result.correctName}.`;
            feedbackP.style.color = 'red';
            handleGameOver();
            return;
        }

        // Load next question after a short delay
        setTimeout(fetchNewQuestion, 1200);
    } catch (err) {
        console.error('Error submitting guess', err);
    }
}

async function handleGameOver() {
    const playerName = prompt(`Game over! Your score is ${score}. Enter your name for the leaderboard:`);
    if (playerName) {
        await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score })
        });
        await fetchLeaderboard();
    }
    score = 0;
    scoreSpan.textContent = score;
    setTimeout(fetchNewQuestion, 1500);
}

async function fetchLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaders = await response.json();
        
        leaderboardList.innerHTML = '';
        leaders.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}: ${entry.score} pts`;
            leaderboardList.appendChild(li);
        });
    } catch (err) {
        console.error('Failed to fetch leaderboard', err);
    }
}

// Initialize game
fetchNewQuestion();
fetchLeaderboard();