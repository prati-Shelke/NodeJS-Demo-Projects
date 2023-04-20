const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const productValidation = require('../validations/product.validation');
const shopValidation = require('../validations/shop.validation');
const productController = require('../controllers/product.controller');
const shopController = require('../controllers/shop.controller');

// Routes: get products, get product
router
  .route('/products')
  .get(validate(productValidation.getProducts), shopController.getProducts);
  
router
  .route('/products/:productId')
  .get(validate(productValidation.getProduct), shopController.getProduct);



module.exports = router;
