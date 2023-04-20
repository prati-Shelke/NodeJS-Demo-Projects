const httpStatus = require('http-status');
const {
  Customer
} = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs')


/**
 * Create a customer
 * @param {Object} customerBody
 * @returns {Promise<Customer>}
 */
const createCustomer = async (customerBody) => {
  if (await Customer.isEmailTaken(customerBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer already exists with this email');
  }
  return Customer.create(customerBody);
};

/**
 * Query for customers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCustomers = async (filter, options) => {
  const customers = await Customer.paginate(filter, options);
  return customers;
};

/**
 * Get customer by id
 * @param {ObjectId} id
 * @returns {Promise<Customer>}
 */
const getCustomerById = async (id) => {
  return Customer.findById(id, { addresses: 0 });
};

/**
 * Get customer and addresses by id
 * @param {ObjectId} id
 * @returns {Promise<Customer>}
 */
const getCustomerAndAddresses = async (id) => {
  return Customer.findById(id);
};

/**
 * Get customer by email
 * @param {string} email
 * @returns {Promise<Customer>}
 */
const getCustomerByEmail = async (email) => {
  return Customer.findOne({
    email
  }, { addresses: 0 });
};

/**
 * Update customer by id
 * @param {ObjectId} customerId
 * @param {Object} updateBody
 * @returns {Promise<Customer>}
 */
const updateCustomerById = async (customerId, updateBody) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer not found');
  }
  if (updateBody.email && (await Customer.isEmailTaken(updateBody.email, customerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer already exists with this email');
  }
  Object.assign(customer, updateBody);
  await customer.save();
  return customer;
};

/**
 * Delete customer by id
 * @param {ObjectId} customerId
 * @returns {Promise<Customer>}
 */
const deleteCustomerById = async (customerId) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer not found');
  }
  await customer.delete();
  return customer;
};


//*********************change password************************
/**
 * change password
 * @param {ObjectId} customerId
 * @param {Object} reqBody
 * @returns {Promise<Customer>}
 */
const changePassword = async(customerId,reqBody) =>
{
  const customer = await getCustomerById(customerId);

  if(await bcrypt.compare(reqBody.old_password , customer.password))
    {
      return updateCustomerById(customerId,{password:reqBody.new_password})
    }
  else
    {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Old password does not match..');
    }
}


module.exports = {
  createCustomer,
  queryCustomers,
  getCustomerById,
  getCustomerByEmail,
  updateCustomerById,
  deleteCustomerById,
  getCustomerAndAddresses,
  changePassword
};
