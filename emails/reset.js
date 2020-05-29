const keys = require('../keys')

module.exports = function(email, token) {
    return {
        api_key: '6toctp76rc9ib5d55ihkcw6cmaqdpp763j9hmoka',
        email: email,
        sender_name: 'Book-Shop',
        sender_email: 'book-shopshop@yandex.by',
        subject: 'Восстановление доступа!',
        body:  `
            <h1>Вы забыли пароль?</h1>
            <p>Если нет, то проигнорируйте данное письмо</p>
            <p>Иначе, нажмите на ссылку ниже:</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить пароль</a></p>
            <hr />
            <a href="${keys.BASE_URL}">Магазин книг</a>
        `,
        list_id: 20716981,
        lang: 'ru'
    }
}