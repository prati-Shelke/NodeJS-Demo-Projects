const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  productService
} = require('../services');

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts({
    deleted: {
      $ne: true
    },
    ...filter
  }, {
    ...options,
    populate: [{
      path: "_org",
      select: "_id name email"
    }],
    projection: {
      updatedAt: 0,
      deleted: 0
    }
  });
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await (await productService.getProductById(req.params.productId)).populate("_org", "_id name email");
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const getCart = catchAsync(async (req, res) => {
  
});

module.exports = {
  getProducts,
  getProduct,
};
