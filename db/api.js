var knex = require('./knex');

module.exports = {
    findUserByUsername: name => knex('users').where('username', name).returning('id').first(),
    createUser: body => knex('users').insert(body, 'id'),
    getUser: id => knex('users').where('id', id).first(),
    findUserById: id => knex('users').where('id', id).first()
}
