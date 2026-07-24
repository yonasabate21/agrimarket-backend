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
  const { title, category, content, description } = req.body;
  const inquiryDetails = description || content;

  if (!title || !inquiryDetails) {
    res.status(400);
    throw new Error('Please provide both a title and inquiry details.');
  }

  const question = new Question({
    farmer: req.user._id,
    title,
    category: category || 'General Agriculture',
    description: inquiryDetails,
    answers: [],
  });

  const createdQuestion = await question.save();
  res.status(201).json(createdQuestion);
});

// @desc    Append diagnostic advice to an inquiry
// @route   POST /api/questions/:id/answers
// @access  Private (Expert only)
const addAnswer = asyncHandler(async (req, res) => {
  const { answerText, content } = req.body;
  const replyText = answerText || content;

  if (!replyText) {
    res.status(400);
    throw new Error('Answer text is required.');
  }

  const question = await Question.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error('Question thread not found');
  }

  const newAnswer = {
    expert: req.user._id,
    expertName: req.user.name || 'Extension Specialist',
    answerText: replyText,
    createdAt: new Date(),
  };

  question.answers.push(newAnswer);
  await question.save();

  res.status(201).json({ message: 'Diagnostic answer appended', question });
});

module.exports = { getQuestions, createQuestion, addAnswer };