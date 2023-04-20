const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/multer')
const feedControllers = require('../Controllers/Feed')


const userControllers = require('../Controllers/User')


router.get('/getUser/:userId',userControllers.getUserById)
router.get('/getAllUser',userControllers.getAllUser)
router.post('/sign-up',userControllers.signup)
router.post('/login',userControllers.login)
router.post('/googleLogin',userControllers.googleLogin)
router.post('/change-password', auth , userControllers.changePassword)
router.put('/edit-profile/:userID', auth , upload.single('profilePicture') , userControllers.editProfile )

module.exports = router 