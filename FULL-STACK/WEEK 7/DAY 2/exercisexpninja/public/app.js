const answerForm = document.querySelector('#answer-form');
const questionText = document.querySelector('#question-text');
const questionNumber = document.querySelector('#question-number');
const questionCount = document.querySelector('#question-count');
const progressFill = document.querySelector('#progress-fill');
const progressLabel = document.querySelector('#progress-label');
const progressTrack = document.querySelector('.progress-track');
const optionsContainer = document.querySelector('#options');
const feedback = document.querySelector('#feedback');
const submitButton = document.querySelector('#submit-button');
const scoreDisplay = document.querySelector('#score');
const scoreTotal = document.querySelector('#score-total');
const quizContent = document.querySelector('#quiz-content');
const resultContent = document.querySelector('#result-content');

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

async function loadQuestions() {
  try {
    const response = await fetch('/api/questions');
    if (!response.ok) throw new Error('Could not load the quiz');
    const data = await response.json();
    questions = data.questions;
    scoreTotal.textContent = `/ ${String(questions.length).padStart(2, '0')}`;
    renderQuestion();
  } catch (error) {
    questionText.textContent = 'The quiz could not be loaded.';
    questionCount.textContent = 'CONNECTION ERROR';
    document.querySelector('#options').innerHTML = '<p class="intro-copy">Check that the server is running, then reload this page.</p>';
    answerForm.querySelector('.form-footer').hidden = true;
  }
}

function renderQuestion() {
  const question = questions[currentIndex];
  if (!question) return showResults();

  answered = false;
  const progress = Math.round((currentIndex / questions.length) * 100);
  questionCount.textContent = `QUESTION ${String(currentIndex + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
  questionNumber.textContent = String(currentIndex + 1).padStart(2, '0');
  progressLabel.textContent = `${progress}% COMPLETE`;
  progressFill.style.width = `${progress}%`;
  progressTrack.setAttribute('aria-valuenow', String(progress));
  questionText.textContent = question.question;
  feedback.hidden = true;
  feedback.textContent = '';
  submitButton.disabled = false;
  submitButton.innerHTML = 'Check answer <span aria-hidden="true">↗</span>';
  optionsContainer.replaceChildren(...question.options.map((option, index) => {
    const label = document.createElement('label');
    label.className = 'option-row';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = String(option.id);
    input.required = true;
    const key = document.createElement('span');
    key.className = 'option-key';
    key.textContent = String.fromCharCode(65 + index);
    const text = document.createElement('span');
    text.className = 'option-text';
    text.textContent = option.text;
    label.append(input, key, text);
    return label;
  }));
}

async function onSubmit(event) {
  event.preventDefault();
  if (answered) {
    currentIndex += 1;
    return renderQuestion();
  }

  const selectedOption = answerForm.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    feedback.className = 'feedback is-wrong';
    feedback.textContent = 'Choose an answer before continuing.';
    feedback.hidden = false;
    return;
  }

  submitButton.disabled = true;
  try {
    const response = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: questions[currentIndex].id, optionId: Number(selectedOption.value) }),
    });
    if (!response.ok) throw new Error('Could not check your answer');
    const result = await response.json();
    answered = true;
    if (result.isCorrect) {
      score += 1;
      scoreDisplay.textContent = String(score).padStart(2, '0');
      feedback.className = 'feedback';
      feedback.textContent = 'That is correct. Nice one!';
    } else {
      feedback.className = 'feedback is-wrong';
      feedback.textContent = `Not quite. The answer is ${result.correctAnswer}.`;
    }
    feedback.hidden = false;
    submitButton.disabled = false;
    submitButton.innerHTML = currentIndex === questions.length - 1
      ? 'See your score <span aria-hidden="true">↗</span>'
      : 'Next question <span aria-hidden="true">↗</span>';
    progressLabel.textContent = `${Math.round(((currentIndex + 1) / questions.length) * 100)}% COMPLETE`;
    progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
    progressTrack.setAttribute('aria-valuenow', String(Math.round(((currentIndex + 1) / questions.length) * 100)));
  } catch (error) {
    feedback.className = 'feedback is-wrong';
    feedback.textContent = 'There was a problem checking your answer. Please try again.';
    feedback.hidden = false;
    submitButton.disabled = false;
  }
}

function showResults() {
  quizContent.hidden = true;
  resultContent.hidden = false;
  const percent = Math.round((score / questions.length) * 100);
  document.querySelector('#result-heading').textContent = score === questions.length
    ? 'Perfect score!'
    : score >= Math.ceil(questions.length / 2) ? 'Nice work.' : 'Good first round.';
  document.querySelector('#result-copy').textContent = `You got ${score} out of ${questions.length} right (${percent}%). Ready for another round?`;
  questionCount.textContent = 'QUIZ COMPLETE';
  progressLabel.textContent = '100% COMPLETE';
  progressFill.style.width = '100%';
  progressTrack.setAttribute('aria-valuenow', '100');
}

answerForm.addEventListener('submit', onSubmit);
document.querySelector('#replay-button').addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  scoreDisplay.textContent = '00';
  resultContent.hidden = true;
  quizContent.hidden = false;
  renderQuestion();
});

loadQuestions();