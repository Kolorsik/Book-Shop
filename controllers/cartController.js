const Book = require('../models/book')

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.bookId._doc,
        id: c.bookId.id,
        count: c.count
    }))
}

function computePrice(books) {
    return books.reduce((total, book) => {
        return total += book.price * book.count
    }, 0)
}

module.exports = {
    postAdd: async function(req, res) {
        const book = await Book.findById(req.body.id)
        await req.user.addToCart(book)
        res.redirect('/cart')
    },
    getIndex: async function(req, res) {
        const user = await req.user
        .populate('cart.items.bookId')
        .execPopulate()

        const books = mapCartItems(user.cart)

        res.render('cart', {
            title: 'Корзина',
            isCart: true,
            books: books,
            price: computePrice(books)
        })
    },
    deleteRemoveId: async function(req, res) {
        await req.user.removeFromCart(req.params.id)
        const user = await req.user.populate('cart.items.bookId').execPopulate()

        const books = mapCartItems(user.cart)
        const cart = {
            books, price: computePrice(books)
        }
        res.status(200).json(cart)
    }
}