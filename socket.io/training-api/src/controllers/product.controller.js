const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  productService
} = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct({
    _org: req.user._org,
    ...req.body
  }, req.files || []);
  res.status(httpStatus.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts({
    deleted: {
      $ne: true
    },
    _org: req.user._org._id,
    ...filter
  }, options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const updateProductImages = catchAsync(async (req, res) => {
  const product = await productService.updateProductImages(
    await productService.getProductById(req.params.productId),
    req.body.delete ? (typeof req.body.delete == "string" ? [req.body.delete] : req.body.delete) : [],
    req.files || []
  );
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateProductImages,
  deleteProduct,
};
