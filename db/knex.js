var environment = process.env.ENV || 'development';
var config = require('../knexfile')[environment];
module.exports = require('knex')(config);
