const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const productValidation = require('../validations/product.validation');
const productController = require('../controllers/product.controller');

const router = express.Router();
const upload = require('multer')();

// Token authentication for all routes defined in this file
router.use(auth());

// Routes: get products, create product
router
  .route('/')
  .post(upload.any('images'), validate(productValidation.createProduct), productController.createProduct)
  .get(validate(productValidation.getProducts), productController.getProducts);

// Routes: get one product, update product, delete product
router
.route('/:productId')
.get(validate(productValidation.getProduct), productController.getProduct)
.patch(validate(productValidation.updateProduct), productController.updateProduct)
.delete(validate(productValidation.deleteProduct), productController.deleteProduct);

// Routes: add or delete product images
router
.route('/images/:productId')
.patch(upload.any('new_images'), validate(productValidation.updateProductImages), productController.updateProductImages)

module.exports = router;