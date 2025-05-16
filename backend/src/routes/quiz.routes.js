const router = require('express').Router();
const questionController = require('../controllers/question.controller');
const quizController = require('../controllers/quiz.controller');
const resultController = require('../controllers/result.controller');
const auth = require('../middlewares/auth.middleware');
// const questionController = require('../controllers/question.controller');
const isAdmin = require('../middlewares/role.middleware')('admin');

router.get('/', auth, quizController.getAllQuizzes);
router.get('/:id', auth, quizController.getQuizWithQuestions);
router.post('/', auth, isAdmin, quizController.createQuiz);
router.post('/:id/submit', auth, resultController.submitQuiz);
router.post('/:id/questions', auth, isAdmin, questionController.addQuestionToQuiz);

module.exports = router;
