const Question = require('../models/Question');
const asyncHandler = require('../middleware/asyncHandler');

//   Retrieve chronological list of inquiries
//   GET /api/questions
//   Public
const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({})
    .populate('farmer', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(questions);
});

//   Publish a technical agricultural problem
//   POST /api/questions
//   Private (Farmer only)
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

//  Append diagnostic advice to an inquiry
//  POST /api/questions/:id/answers
//  Private (Expert only)
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
    content: replyText, // 💡 Saves under both keys so frontend always displays text
    createdAt: new Date(),
  };

  question.answers.push(newAnswer);
  
  // 🔧 FIXED: Single save with validateModifiedOnly to bypass missing top-level field errors
  await question.save({ validateModifiedOnly: true });

  res.status(201).json({ message: 'Diagnostic answer appended', question });
});

module.exports = { getQuestions, createQuestion, addAnswer };