const express = require('express');
const productController = require('../controllers/productControllerMongo');

const router = express.Router();

// Add logging middleware to the router
router.use((req, res, next) => {
  console.log('PRODUCT ROUTER HIT:', req.method, req.url);
  next();
});

router
  .route('/top-3-cheap')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router
  .route('/product-category')
  .get(productController.getProductCategoryStats);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
