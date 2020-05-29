const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    admin: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                bookId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true
                }
            }
        ]
    }
})


userSchema.methods.addToCart = function(book) {
    const items = this.cart.items.concat()
    const idx = items.findIndex(c => {
        return c.bookId.toString() === book._id.toString()
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            bookId: book._id,
            count: 1
        })
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let items = this.cart.items.concat()
    const idx = items.findIndex(c => {
        return c.bookId.toString() === id.toString()
    })

    if (items[idx].count === 1) {
        items = items.filter(c => c.bookId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)