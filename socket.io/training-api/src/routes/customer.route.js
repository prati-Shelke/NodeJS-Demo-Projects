const express = require('express');
const customerAuth = require('../middlewares/customer-auth');
const validate = require('../middlewares/validate');
const customerValidation = require('../validations/customer.validation');
const customerController = require('../controllers/customer.controller');

const router = express.Router();
const upload = require('multer')();

// Token authentication for all routes defined in this file
router.use(customerAuth());

router
  .route('/update-profile')
  .patch(validate(customerValidation.updateProfile), customerController.updateProfile)

router
  .route('/profile-picture')
  .post(upload.single('picture'), validate(customerValidation.updatePicture), customerController.updatePicture)
  .delete(customerController.removePicture)

router
  .route('/account')
  .delete(customerController.deleteAccount);

router
  .route('/address')
  .get(customerController.getAddresses)
  .post(customerController.newAddress)

router
  .route('/address/:addressId')
  .get(customerController.getAddress)
  .put(customerController.updateAddress)
  .delete(customerController.deleteAddress)

  
//*********************change passeord************************/
router
  .route("/auth/change-password")
  .post(validate(customerValidation.changePassword),customerController.changePassword)


module.exports = router;
