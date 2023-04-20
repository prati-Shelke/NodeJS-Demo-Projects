const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require('../utils/cloudinary');

const {
  customerService
} = require('../services');

const updateProfile = catchAsync(async (req, res) => {
  const customer = await customerService.updateCustomerById(req.customer._id, req.body);
  res.send(customer);
});

const deleteAccount = catchAsync(async (req, res) => {
  await customerService.deleteCustomerById(req.customer._id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updatePicture = catchAsync(async (req, res) => {
  if(!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing file");
  }
  if(!req.file.mimetype.includes("image")) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "File must be an image");
  }
  const { url } = await cloudinary.upload(req.file);
  await customerService.updateCustomerById(req.customer._id, {
    picture: url
  });
  res.send({ picture: url });
});

const removePicture = catchAsync(async (req, res) => {
  const picture = req.customer.picture.split("/");
  if(picture.length > 4) {
    await cloudinary.destroy(`${picture[picture.length - 2]}/${picture[picture.length - 1].replace(".jpg", "")}`);
    await customerService.updateCustomerById(req.customer._id, {
      picture: "https://i.imgur.com/CR1iy7U.png"
    });
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const newAddress = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerAndAddresses(req.customer._id);
  customer.addresses.push(req.body);
  await customer.save();
  res.send(customer.addresses[customer.addresses.length - 1]);
});

const updateAddress = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerAndAddresses(req.customer._id);
  const index = customer.addresses.findIndex((address) => {
    return address._id.toString() == req.params.addressId;
  })
  customer.addresses[index] = { ...req.body, _id: ObjectId(req.params.addressId) };
  await customer.save();
  res.send(customer.addresses[index]);
});

const getAddress = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerAndAddresses(req.customer._id);
  const index = customer.addresses.findIndex((address) => {
    return address._id.toString() == req.params.addressId;
  })
  res.send(customer.addresses[index]);
});

const getAddresses = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerAndAddresses(req.customer._id);
  res.send(customer.addresses);
});

const deleteAddress = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerAndAddresses(req.customer._id);
  const index = customer.addresses.findIndex((address) => {
    return address._id.toString() == req.params.addressId;
  })
  customer.addresses.splice(index, 1);
  await customer.save();
  res.status(httpStatus.NO_CONTENT).send();
});

//*********************change password************************
const changePassword = catchAsync(async(req,res) => 
{
    await customerService.changePassword(req.customer._id,req.body)
    res.send(httpStatus.NO_CONTENT);
})

module.exports = {
  updateProfile,
  deleteAccount,
  updatePicture,
  removePicture,
  newAddress,
  updateAddress,
  getAddresses,
  getAddress,
  deleteAddress,
  changePassword
};
