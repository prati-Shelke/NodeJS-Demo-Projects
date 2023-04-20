const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const feedControllers = require('../Controllers/Feed')
const auth = require('../middleware/auth');

router.post('/postFeed',auth,upload.single('photo'),feedControllers.postFeed)
router.get('/getAllFeeds',feedControllers.getAllFeeds)
router.get('/getFeeds',feedControllers.getFeeds)
router.put('/comments/:feedId',feedControllers.putComments)
router.put('/likes/:feedId',feedControllers.putLikes)


module.exports = router
