const User = require('../models/user')
const keys = require('../keys')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const UniSender = require('unisender')
const {body, validationResult} = require('express-validator')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

module.exports = {
    getLogin: async function(req, res) {
        res.render('auth/login', {
            title: 'Авторизация',
            isLogin: true,
            loginError: req.flash('loginError'),
            registerError: req.flash('registerError')
        })
    },
    postLogin: async function(req, res) {
        try {
            const {email, password} = req.body
    
            const candidate = await User.findOne({email})
    
            if (candidate) {
                const areSame = await bcrypt.compare(password, candidate.password)
    
                if (areSame) {
                    if (candidate.admin) {
                        req.session.isAdmin = true
                    }
                    req.session.user = candidate
                    req.session.isAuthenticated = true
                    req.session.save(err => {
                        if (err) {
                            throw err
                        }
                        res.redirect('/')
                    })
                } else {
                    req.flash('loginError', 'Неверный пароль')
                    res.redirect('/auth/login#login')
                }
            } else {
                req.flash('loginError', 'Такого пользователя не существует')
                res.redirect('/auth/login#login')
            }
        } catch(e) {
            console.log(e)
        }    
    },
    getLogout: async function(req, res) {
        req.session.destroy(() => {
            res.redirect('/auth/login#login')
        })
    },
    postRegister: async function(req, res) {
        try {
            const {email, password, name} = req.body
    
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                req.flash('registerError', errors.array()[0].msg)
                return res.status(422).redirect('/auth/login#register')
            }
    
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            
            var uniSender = new UniSender({
                api_key: '6toctp76rc9ib5d55ihkcw6cmaqdpp763j9hmoka',
                lang: 'ru'
            })
    
            //await uniSender.sendEmail(regEmail(email))
            
            res.redirect('/auth/login#login')
    
        } catch (e) {
            console.log(e)
        }
    },
    getReset: async function(req, res) {
        res.render('auth/reset', {
            title: 'Забыли пароль?',
            error: req.flash('error')
        })
    },
    postReset: async function(req, res) {
        try {
            crypto.randomBytes(32, async (err, buffer) => {
                if (err) {
                    req.flash('error', 'Что-то пошло не так, повторите попытку позже')
                    return res.redirect('/auth/reset')
                }
    
                const token = buffer.toString('hex')
    
                const candidate = await User.findOne({email: req.body.email})
    
                if (candidate) {
                    candidate.resetToken = token
                    candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                    await candidate.save()
                    console.log(token)

                    var uniSender = new UniSender({
                        api_key: '6toctp76rc9ib5d55ihkcw6cmaqdpp763j9hmoka',
                        lang: 'ru'
                    })

                    await uniSender.sendEmail(resetEmail(candidate.email, token))
                    res.redirect('/auth/login')
                } else {
                    req.flash('error', 'Такого email нет')
                    res.redirect('/auth/reset')
                }
            })
        } catch (e) {
            console.log(e)
        }
    },
    getPasswordToken: async function(req, res) {
        if (!req.params.token) {
            return res.redirect('/auth/login')
        }
    
        try {
            const user = await User.findOne({
                resetToken: req.params.token,
                resetTokenExp: {$gt: Date.now()}
            })
    
            if (!user) {
                return res.redirect('/auth/login')
            } else {
                res.render('auth/password', {
                    title: 'Восстановить доступ',
                    error: req.flash('error'),
                    userId: user._id.toString(),
                    token: req.params.token
                })
            }
        } catch (e) {
            console.log(e)
        }
    },
    postPassword: async function(req, res) {
        try {
            const user = await User.findOne({
                _id: req.body.userId,
                resetToken: req.body.token,
                resetTokenExp: {$gt: Date.now()}
            })
    
            if (user) {
                user.password = await bcrypt.hash(req.body.password, 10)
                user.resetToken = undefined
                user.resetTokenExp = undefined
                await user.save()
                res.redirect('/auth/login')
            } else {
                req.flash('loginError', 'Время жизни токена истекло')
                res.redirect('/auth/login')
            }
    
        } catch (e) {
            console.log(e)
        }
    }
}