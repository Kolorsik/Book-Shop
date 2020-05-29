const Book = require('../models/book')
const {validationResult} = require('express-validator')


module.exports = {
    index: function (req, res) {
        res.render('add', {
            title: 'Добавить книгу',
            isAdd: true
        })
    },
    addBook: async function (req, res) {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).render('add', {
                title: 'Добавить книгу',
                isAdd: true,
                error: errors.array()[0].msg,
                data: {
                    title: req.body.title,
                    price: req.body.price,
                    img: req.body.img,
                    desc: req.body.desc,
                    author: req.body.author
                }
            })
        }

        const book = new Book({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            userId: req.user,
            desc: req.body.desc,
            author: req.body.author
        })

        try{
            await book.save()
            res.redirect('/books')
        } catch (e) {
            console.log(e)
        }
    }
}