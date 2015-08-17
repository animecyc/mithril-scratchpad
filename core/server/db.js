var low = require('lowdb');
var db = low('db.json');

db._.mixin(require('underscore-db'));

module.exports = db;
