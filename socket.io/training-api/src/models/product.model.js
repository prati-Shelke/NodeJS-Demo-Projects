const mongoose = require('mongoose');
const { private, paginate, softDelete } = require('./plugins');

var Cloudinary = mongoose.Schema({
  public_id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, {
  _id: false
});

const productSchema = mongoose.Schema(
  {
    _org: {
      type: mongoose.Types.ObjectId,
      ref: "organizations"
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [Cloudinary],
    price: {
      type: Number,
      default: 1
    }
  }, {
  timestamps: true,
});

productSchema.plugin(softDelete);
productSchema.plugin(private);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
