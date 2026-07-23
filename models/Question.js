const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  answers: [{
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expertName: { type: String, required: true },
    answerText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);