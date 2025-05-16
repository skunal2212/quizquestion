const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const { question_text, options, correct_option_index } = req.body;

        // Validate input
        if (
            !question_text ||
            !Array.isArray(options) ||
            typeof correct_option_index !== 'number' ||
            correct_option_index < 0 ||
            correct_option_index >= options.length
        ) {
            return res.status(400).json({ error: 'Invalid question data' });
        }

        // Optional: Check quiz exists
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        const question = await Question.create({
            QuizId,
            question_text,
            options,
            correct_option_index,
        });

        res.status(201).json({ question });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add question to quiz' });
    }
};