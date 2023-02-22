const { v4: uuid } = require('uuid');

module.exports = class User {
    constructor(
        email = 'test@mail.ru',
        id = uuid()
    ) {
        this.id = id;
        this.email = email;
    }
}