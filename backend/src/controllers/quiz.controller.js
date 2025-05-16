const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');


exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = await Quiz.create({ title, description });
    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        await Question.create({ ...q, QuizId: quiz.id });
      }
    }
    res.status(201).json({ quiz });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.findAll();
  res.json({ quizzes });
};

exports.getQuizWithQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{
        model: Question,
        attributes: ['id', 'question_text', 'options'] // don’t include correct_option_index
      }]
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.json({ quiz });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
