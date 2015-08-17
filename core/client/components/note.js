module.exports = function(m) {
  var layout = require('./layouts/default');
  var state = {};

  function getNotes() {
    return m.request({
      method: 'GET',
      url: '/api/notes'
    });
  }

  function findNote(id, notes) {
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];

      if (note.id === id) {
        return note;
      }
    }
  }

  return {
    index: {
      controller: function() {
        if (!state.notes) {
          getNotes().then(function(notes) {
            state.notes = notes;

            if (notes.length > 0) {
              m.route('/notes/' + notes[0].id);
              m.redraw.strategy('diff');
            }
          });
        } else if (state.notes.length > 0) {
          m.route('/notes/' + state.notes[0].id);
          m.redraw.strategy('diff');
        }
      },
      view: function(ctrl) {
        return layout([
          m.component(require('./partials/listing'), {
            notes: []
          })
        ]);
      }
    },
    preview: {
      controller: function() {
        var noteId = m.route.param('note');
        var handleNotes = function(notes) {
          var note = findNote(noteId, notes);

          this.notes(notes);
          this.currentNote(note || {});
        }.bind(this);

        this.notes = m.prop(state.notes || []);
        this.currentNote = m.prop({});

        if (!state.notes) {
          getNotes().then(handleNotes);
        } else {
          handleNotes(state.notes);
        }
      },
      view: function(ctrl) {
        return layout([
          m.component(require('./partials/listing'), {
            notes: ctrl.notes()
          }),
          m.component(require('./partials/preview'), {
            content: ctrl.currentNote()
          })
        ]);
      }
    },
    create: {
      view: function(ctrl) {
        return layout([
          m.component(require('./partials/editor'), {
            state: state
          })
        ]);
      }
    },
    update: {
      controller: function() {
        this.note = m.request({
          method: 'GET',
          url: '/api/notes/' + m.route.param('note')
        });
      },
      view: function(ctrl) {
        return layout([
          m.component(require('./partials/editor'), {
            state: state,
            note: ctrl.note()
          })
        ]);
      }
    }
  };
};
