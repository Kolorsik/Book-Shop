const keys = require('../keys')

module.exports = function(email) {
    return {
        api_key: '6toctp76rc9ib5d55ihkcw6cmaqdpp763j9hmoka',
        email: email,
        sender_name: 'Book-Shop',
        sender_email: 'book-shopshop@yandex.by',
        subject: 'Успешная регистрация!',
        body: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали аккаунт - ${email}</p>
            <hr />
            <a href="${keys.BASE_URL}">Магазин книг</a>
        `,
        list_id: 20716981,
        lang: 'ru'
    }
}