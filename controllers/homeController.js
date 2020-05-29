module.exports = {
    getIndex: async function(req, res) {
        res.render('index', {
            title: 'Главная страница',
            isHome: true
        })
    }
}