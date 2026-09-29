const express = require('express');
const { listQuestions, submitAnswer } = require('../controllers/questionController');

const router = express.Router();

router.get('/questions', listQuestions);
router.post('/answers', submitAnswer);

module.exports = router;