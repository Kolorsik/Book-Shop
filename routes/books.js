const {Router} = require('express')
const Book = require('../models/book')
const Order = require('../models/order')
const {validationResult} = require('express-validator')
const auth = require('../middleware/auth')
const authAdm = require('../middleware/adm')
const booksController = require('../controllers/booksController')
const {booksValidators} = require('../utils/validators')
const router = Router()

router.post('/', booksController.postIndex)

router.get('/', booksController.getIndex)

router.post('/remove', auth, booksController.postRemove)

router.post('/rating', auth, booksController.postRating)

router.get('/:id/edit', auth, authAdm, booksController.getIdEdit)

router.post('/edit', auth, authAdm, booksValidators, booksController.postEdit)

router.get('/:id', booksController.getId)

module.exports = router