const {Router} = require('express')
const Order = require('../models/order')
const ordersController = require('../controllers/ordersController')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, ordersController.getIndex)

router.post('/', auth, ordersController.postIndex)

module.exports = router