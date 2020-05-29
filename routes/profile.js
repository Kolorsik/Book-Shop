const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const profileController = require('../controllers/profileController')
const router = Router()

router.get('/', auth, profileController.getIndex)

router.post('/', auth, profileController.postIndex)

module.exports = router