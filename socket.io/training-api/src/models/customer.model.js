const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { private, paginate, softDelete } = require('./plugins');

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    picture: {
      type: String,
      default: "https://i.imgur.com/CR1iy7U.png"
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the private plugin
    },
    addresses: [{
      street: {
        type: String,
        required: true
      },
      addressLine2: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pin: {
        type: String,
        minLength: 6,
        maxLength: 6
      }
    }]
  },
  {
    timestamps: true,
  }
);

customerSchema.plugin(softDelete);
customerSchema.plugin(private);
customerSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The customer's email
 * @param {ObjectId} [excludeCustomerId] - The id of the customer to be excluded
 * @returns {Promise<boolean>}
 */
customerSchema.statics.isEmailTaken = async function (email, excludeCustomerId) {
  const customer = await this.findOne({ email, _id: { $ne: excludeCustomerId } });
  return !!customer;
};

/**
 * Check if password matches the customer's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
customerSchema.methods.isPasswordMatch = async function (password) {
  const customer = this;
  return bcrypt.compare(password, customer.password);
};

customerSchema.pre('save', async function (next) {
  const customer = this;
  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8);
  }
  next();
});

/**
 * @typedef Customer
 */
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
