const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Fetch all active listings
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Populate the 'farmer' reference to fetch vendor name, phone, and location
  const products = await Product.find({})
    .populate('farmer', 'name phone')
    .sort({ createdAt: -1 });

  res.status(200).json(products);
});

// @desc    Insert a new bulk crop listing
// @route   POST /api/products
// @access  Private (Farmer only)
const createProduct = asyncHandler(async (req, res) => {
  const { cropName, quantity, price, location } = req.body;

  const product = new Product({
    farmer: req.user._id,
    cropName,
    quantity,
    price,
    location,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Permanently delete a marketplace listing
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Listing not found');
  }

  // Auth gate: Ensure the user deleting is the farmer who owns the listing
  if (product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized action. You do not own this listing.');
  }

  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Product listing removed successfully' });
});

module.exports = { getProducts, createProduct, deleteProduct };