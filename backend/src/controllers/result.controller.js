const Result = require('../models/result.model');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

exports.submitQuiz = async (req, res) => {
  const quizId = req.params.id;
  const userId = req.user.id;
  const { answers } = req.body;

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const questions = await Question.findAll({ where: { QuizId: quizId } });
  let score = 0;
  questions.forEach((q, index) => {
    if (answers[index] === q.correct_option_index) score++;
  });

  const result = await Result.create({
    score,
    total: questions.length,
    UserId: userId,
    QuizId: quizId
  });

  res.json({
    score,
    total: questions.length,
    resultId: result.id,
    message: `Quiz attempt recorded. You may retake quizzes.`
  });
};

exports.getResults = async (req, res) => {
  const results = await Result.findAll({
    where: { UserId: req.user.id },
    include: [Quiz]
  });
  res.json({ results });
};
