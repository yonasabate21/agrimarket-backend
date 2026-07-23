const express = require('express');
const router = express.Router();
const { getQuestions, createQuestion, addAnswer } = require('../controllers/questionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(getQuestions)
  .post(protect, authorizeRoles('farmer'), createQuestion);

router.route('/:id/answers')
  .post(protect, authorizeRoles('expert'), addAnswer);

module.exports = router;