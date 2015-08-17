var m = require('mithril');
var note = require('./components/note')(m);

m.route(document.body, '/', {
  '/': note.index,
  '/editor': note.create,
  '/notes/:note': note.preview,
  '/notes/:note/edit': note.update
});
