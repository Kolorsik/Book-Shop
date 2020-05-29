const User = require('../models/user')

module.exports = {
    getIndex: async function(req, res) {
        res.render('profile', {
            title: 'Профиль',
            isProfile: true,
            user: req.user.toObject()
        })
    },
    postIndex: async function(req, res) {
        try {
            const user = await User.findById(req.user._id)
    
            user.name = req.body.name
    
            await user.save()
            res.redirect('/profile')
    
        } catch (e) {
            console.log(e)
        }
    }
}