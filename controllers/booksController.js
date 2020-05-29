const Book = require('../models/book')
const Order = require('../models/order')
const {validationResult} = require('express-validator')


function isOwner(book, req) {
    return book.userId.toString() === req.user._id.toString()
}

module.exports = {
    postIndex: async function(req, res) {
        const {name, author, price1, price2, rating1, rating2, sort} = req.body
        const filter = {}
        const back = {}
        const sortB = {}
        if (name != '') {
            filter.title = new RegExp(`^(${name}).*`, 'gmi') 
            back.title = name
        }

        if (author != '') {
            filter.author = new RegExp(`^(${author}).*`, 'gmi') 
            back.author = author
        }

        if (price2 != '') {
            filter.price = {$lt: price2}
            back.price2 = price2
        }

        if (price1 != '') {
            filter.price = {$gt: price1}
            back.price1 = price1
            if (price2 != '') {
                filter.price = {$gt: price1, $lt: price2}
            }
        }

        if (rating2 != '') {
            filter.rating = {$lt: rating2}
            back.rating2 = rating2
        }

        if (rating1 != '') {
            filter.rating = {$gt: rating1}
            back.rating1 = rating1
            if (rating2 != '') {
                filter.rating = {$gt: rating1, $lt: rating2}
            }
        }

        switch(sort) {
            case "prAsc":
                sortB.price = 1
                break
            case "prDesc":
                sortB.price = -1
                break
            case "popAsc":
                sortB.rating = 1
                break
            case "popDesc":
                sortB.rating = -1
                break
        }

        const books = await Book.find(filter).sort(sortB)

        return res.render('books', {
            title: 'Книги',
            isBooks: true,
            userId: req.user ? req.user._id.toString() : null,
            books,
            back
        })
    },
    getIndex: async function(req, res) {
        try {
            const books = await Book.find().lean().populate('userId', 'email name').select('price title img author').sort({title: 1})
    
            res.render('books', {
                title: 'Книги',
                isBooks: true,
                userId: req.user ? req.user._id.toString() : null,
                books
            })
        } catch (e) {
            console.log(e)
        }
    },
    postRemove: async function(req, res) {
        try {
            await Book.deleteOne({
                _id: req.body._id,
                userId: req.user._id
            })
            res.redirect('/books')
        } catch (e) {
            console.log(e)
        }
    },
    postRating: async function(req, res) {
        let r = false
        const order = await Order.find({'user.userId': req.user._id}).populate('user.userId')
        for (let i = 0; i < order.length; i++) {
            for (let y = 0; y < order[i].books.length; y++) {
                if (order[i].books[y].book._id == req.body._id) {
                    if (!order[i].books[y].rating) {
                        const book = await Book.findOne({_id: req.body._id})
                        book.rating = book.rating + parseInt(req.body.rating)
                        order[i].books[y].rating = parseInt(req.body.rating)
                        await book.save()
                        await order[i].save()
                        r = true
                    }
                }
            }
        }
        if (r) {
            res.redirect(`/books/${req.body._id}`)
        }
        else {
            const book = await Book.findById(req.body._id).lean()
            res.render('book', {
                layout: 'empty',
                title: `Книга ${book.title}`,
                bookError: 'Ошибка при выставлении оценки',
                book
            })
        }
    },
    getIdEdit: async function(req, res) {
        try {
            const book = await Book.findById(req.params.id).lean()
    
            if (!isOwner(book, req)) {
                return res.redirect('/books')
            }
    
            res.render('book-edit', {
                title: `Редактировать ${book.title}`,
                book
            })
    
        } catch (e) {
            console.log(e)
        }
    },
    postEdit: async function(req, res) {
        const errors = validationResult(req)
        const {_id} = req.body


       // if (!errors.isEmpty()) {
         //   return res.status(422).redirect(`/books/${_id}/edit`)

        if (!errors.isEmpty()) {
            return res.status(422).render('book-edit', {
                title: `Редактировать ${req.body.title}`,
                error: errors.array()[0].msg,
                data: {
                    title: req.body.title,
                    price: req.body.price,
                    img: req.body.img,
                    desc: req.body.desc,
                    author: req.body.author,
                    id: req.body._id
                }
            })
        }
        //}

        try {
            delete req.body._id
            const book = await Book.findById(_id)
            if (!isOwner(book, req)) {
                return res.redirect('/books')
            }
            await Book.findByIdAndUpdate(_id, req.body)
            res.redirect('/books')
        } catch (e) {
            console.log(e)
        }
    },
    getId: async function(req, res) {
        try {
            const book = await Book.findById(req.params.id).lean()
            res.render('book', {
                layout: 'empty',
                title: `Книга ${book.title}`,
                book
            })
        } catch (e) {
            console.log(e)
        }
    }
}