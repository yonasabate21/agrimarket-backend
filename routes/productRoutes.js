const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, authorizeRoles('farmer'), createProduct);

router.route('/:id')
  .delete(protect, authorizeRoles('farmer'), deleteProduct);

module.exports = router;