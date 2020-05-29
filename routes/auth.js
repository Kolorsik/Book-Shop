const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {body, validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const authController = require('../controllers/authController')
const UniSender = require('unisender')
const {registerValidators} = require('../utils/validators')
const router = Router()

router.get('/login', authController.getLogin)

router.get('/logout', authController.getLogout)

router.post('/login', authController.postLogin)

router.post('/register', registerValidators, authController.postRegister)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/password/:token', authController.getPasswordToken)

router.post('/password', authController.postPassword)

module.exports = router