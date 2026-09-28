const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const gameDirectory = __dirname;

// Middleware
app.use(express.json());
app.use(express.static(gameDirectory));

app.get('/', (req, res) => {
    res.sendFile(path.join(gameDirectory, 'dailychallenge-emoji guessing game.html'));
});

// Emoji Database with IDs
const emojis = [
    { id: 1, emoji: '😀', name: 'Smile' },
    { id: 2, emoji: '🐶', name: 'Dog' },
    { id: 3, emoji: '🌮', name: 'Taco' },
    { id: 4, emoji: '🐱', name: 'Cat' },
    { id: 5, emoji: '🍕', name: 'Pizza' },
    { id: 6, emoji: '🚀', name: 'Rocket' },
    { id: 7, emoji: '⚽', name: 'Soccer Ball' },
    { id: 8, emoji: '🎸', name: 'Guitar' },
    { id: 9, emoji: '🌵', name: 'Cactus' },
    { id: 10, emoji: '🔥', name: 'Fire' }
];

// In-memory leaderboard
let leaderboard = [
    { name: 'Alice', score: 5 },
    { name: 'Bob', score: 3 }
];

// Helper function to shuffle an array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// GET /api/game/question - Returns a random emoji and multiple choice options
app.get('/api/game/question', (req, res) => {
    const correctEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const incorrectOptions = emojis
        .filter(e => e.id !== correctEmoji.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(e => e.name);

    const options = shuffle([...incorrectOptions, correctEmoji.name]);

    res.json({
        id: correctEmoji.id,
        emoji: correctEmoji.emoji,
        options: options
    });
});

// POST /api/game/guess - Check user guess
app.post('/api/game/guess', (req, res) => {
    const { id, guess } = req.body;
    const targetEmoji = emojis.find(e => e.id === id);

    if (!targetEmoji) {
        return res.status(404).json({ error: 'Emoji not found' });
    }

    if (typeof guess !== 'string' || !guess.trim()) {
        return res.status(400).json({ error: 'A guess is required' });
    }

    const isCorrect = targetEmoji.name.toLowerCase() === guess.trim().toLowerCase();
    res.json({
        correct: isCorrect,
        correctName: targetEmoji.name
    });
});

// GET /api/leaderboard - Get top scores
app.get('/api/leaderboard', (req, res) => {
    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 5);
    res.json(sortedLeaderboard);
});

// POST /api/leaderboard - Submit score
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;
    if (typeof name !== 'string' || !name.trim() || !Number.isInteger(score) || score < 0) {
        return res.status(400).json({ error: 'Name and score are required' });
    }

    leaderboard.push({ name: name.trim().slice(0, 20), score });
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
    res.status(201).json({ message: 'Score saved successfully' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Emoji game server running at http://localhost:${PORT}`);
});