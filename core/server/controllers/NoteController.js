var db = require('../db');

/**
 * NoteController
 *
 * @constructor
 */
function NoteController() {
  this.notes = db('notes');
}

/**
 * List all notes in descending order
 *
 * @param  {Request} req
 * @param  {Reply}   reply
 * @return {[type]}
 */
NoteController.prototype.index = function(req, reply) {
  reply(this.notes.sortByOrder('created_at', ['desc']));
};

/**
 * Get a note by ID
 *
 * @param {Request} req
 * @param {Reply}   reply
 */
NoteController.prototype.show = function(req, reply) {
  var note = this.notes.findWhere({
    id: req.params.notes
  });

  if (note) {
    return reply(note);
  }

  reply({
    statusCode: 404,
    error: 'Note [' + req.params.notes + '] not found'
  }).code(404);
};

/**
 * Create a new note
 *
 * @param {Request} req
 * @param {Reply}   reply
 */
NoteController.prototype.store = function(req, reply) {
  var payload = req.payload || {};
  var now = new Date();
  var note = this.notes.insert({
    title: payload.title || '(Untitled)',
    content: payload.content,
    created_at: +now,
    updated_at: +now,
  });

  reply(note).code(201);
};

/**
 * Update a note by ID
 *
 * @param {Request} req
 * @param {Reply}   reply
 */
NoteController.prototype.update = function(req, reply) {
  var payload = req.payload || {};
  var note = this.notes.findWhere({
    id: req.params.notes
  });

  db._.extend(note, {
    title: payload.title || '(Untitled)',
    content: payload.content,
    updated_at: +new Date()
  });

  this.notes.save();

  reply(note);
};

/**
 * Delete a note by ID
 *
 * @param {Request} req
 * @param {Reply}   reply
 */
NoteController.prototype.destroy = function(req, reply) {
  this.notes.remove({
    id: req.params.notes
  });

  this.notes.save();

  reply({
    statusCode: 204,
    success: 'Note [' + req.params.notes + '] deleted'
  }).code(204);
};

module.exports = NoteController;
