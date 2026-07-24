const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Matches your User model name
    },
    cropName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Cereals',
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: String,
    image: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);