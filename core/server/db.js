var low = require('lowdb');
var db = low('db.json');

// Gives us access to some nice ID-based methods
db._.mixin(require('underscore-db'));

module.exports = db;
