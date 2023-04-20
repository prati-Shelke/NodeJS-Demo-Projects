const httpStatus = require('http-status');
const Readable = require('stream').Readable;
const {
  Product
} = require('../models');
const ApiError = require('../utils/ApiError');
const cloudinary = require('../utils/cloudinary');

/**
 * Create a product
 * @param {Object} productBody
 * @param {Array} files
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody, files) => {
  const images = [];
  for (let file of files) {
    images.push(await cloudinary.upload(file));
  }
  return Product.create({ images, ...productBody });
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Update product images
 * @param {Array} delete
 * @param {Array} files
 * @returns {Promise<Product>}
 */
const updateProductImages = async (product, delete_images, files) => {
  console.log(delete_images)
  const images = product.images.filter(image => {
    return !delete_images.includes(image.public_id);
  });
  for (let public_id of delete_images) {
    await cloudinary.destroy(public_id);
  }
  for (let file of files) {
    images.push(await cloudinary.upload(file));
  }

  return Product.findByIdAndUpdate(product._id, {
    $set: {
      images
    }
  }, {
    new: true
  });
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found');
  } else {
    for (let image of product.images || []) {
      await cloudinary.destroy(image.public_id);
    }
  }
  await product.delete();
  return product;
};

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  updateProductImages
};
