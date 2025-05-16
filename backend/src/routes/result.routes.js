const router = require('express').Router();
const resultController = require('../controllers/result.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, resultController.getResults);

module.exports = router;
