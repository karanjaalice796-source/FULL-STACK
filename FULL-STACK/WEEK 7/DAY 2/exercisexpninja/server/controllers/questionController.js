const questionModel = require('../models/questionModel');

async function listQuestions(req, res, next) {
  try {
    res.json({ questions: await questionModel.getQuestions() });
  } catch (error) {
    next(error);
  }
}

async function submitAnswer(req, res, next) {
  const { questionId, optionId } = req.body;
  if (!Number.isInteger(questionId) || !Number.isInteger(optionId)) {
    return res.status(400).json({ error: 'questionId and optionId must be integers' });
  }

  try {
    const result = await questionModel.checkAnswer(questionId, optionId);
    if (!result) return res.status(404).json({ error: 'Question not found' });
    if (result.invalidOption) {
      return res.status(400).json({ error: 'That option does not belong to this question' });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { listQuestions, submitAnswer };