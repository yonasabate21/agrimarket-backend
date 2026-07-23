const Question = require('../models/Question');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Retrieve chronological list of inquiries
// @route   GET /api/questions
// @access  Public
const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({})
    .populate('farmer', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(questions);
});

// @desc    Publish a technical agricultural problem
// @route   POST /api/questions
// @access  Private (Farmer only)
const createQuestion = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const question = new Question({
    farmer: req.user._id,
    title,
    description,
    answers: [],
  });

  const createdQuestion = await question.save();
  res.status(201).json(createdQuestion);
});

// @desc    Append diagnostic advice to an inquiry
// @route   POST /api/questions/:id/answers
// @access  Private (Expert only)
const addAnswer = asyncHandler(async (req, res) => {
  const { answerText } = req.body;
  const question = await Question.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error('Question thread not found');
  }

  const newAnswer = {
    expert: req.user._id,
    expertName: req.user.name,
    answerText,
    createdAt: new Date(),
  };

  // Push answer directly into the document nested array
  question.answers.push(newAnswer);
  await question.save();

  res.status(201).json({ message: 'Diagnostic answer appended', question });
});

module.exports = { getQuestions, createQuestion, addAnswer };