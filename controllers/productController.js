const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Fetch all active listings
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('farmer', 'name phone email')
    .sort({ createdAt: -1 });

  res.status(200).json(products);
});

// @desc    Insert a new bulk crop listing
// @route   POST /api/products
// @access  Private (Farmer only)
const createProduct = asyncHandler(async (req, res) => {
  // Read fields flexible to both naming conventions (title or cropName)
  const { title, cropName, category, quantity, price, location, phone, image, description } = req.body;

  const resolvedCropName = cropName || title;

  if (!resolvedCropName) {
    res.status(400);
    throw new Error('Please provide a title/cropName for the listing');
  }

  // Ensure user is attached from auth middleware
  if (!req.user) {
    res.status(401);
    throw new Error('User authentication required');
  }

  const product = new Product({
    farmer: req.user._id,
    cropName: resolvedCropName,
    category: category || 'Cereals',
    quantity: Number(quantity) || 0,
    price: Number(price) || 0,
    location,
    phone,
    image,
    description,
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

  if (!req.user) {
    res.status(401);
    throw new Error('Authentication required');
  }

  // Ensure owner check works safely
  const farmerId = product.farmer ? product.farmer.toString() : null;
  if (farmerId !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized action. You do not own this listing.');
  }

  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Product listing removed successfully' });
});

module.exports = { getProducts, createProduct, deleteProduct };