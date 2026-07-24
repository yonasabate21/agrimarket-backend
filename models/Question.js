const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General Agriculture',
    },
    description: {
      type: String,
      required: [true, 'Please provide details or symptoms'],
    },
    answers: [
      {
        expert: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        expertName: {
          type: String,
          required: true,
        },
        answerText: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);