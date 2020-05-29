const {Router} = require('express')
const {validationResult} = require('express-validator')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const authAdm = require('../middleware/adm')
const addController = require('../controllers/addController')
const {booksValidators} = require('../utils/validators')
const router = Router()

router.get('/', auth, authAdm, addController.index)

router.post('/', auth, authAdm, booksValidators, addController.addBook)

module.exports = router