const {Router} = require('express')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const cartController = require('../controllers/cartController')
const router = Router()

router.post('/add', auth, cartController.postAdd)

router.get('/', auth, cartController.getIndex)

router.delete('/remove/:id', auth, cartController.deleteRemoveId)

module.exports = router