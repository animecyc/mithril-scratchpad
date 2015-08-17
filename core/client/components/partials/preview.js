var m = require('mithril');
var marked = require('../../marked');

module.exports = {
  controller: function(props) {
    props = props || {};
    this.preview = m.prop(props.content || '');
  },
  view: function(ctrl) {
    return m('.notes-list-preview', [
      m('.preview-meta', [
        m('a.btn[href=/notes/' + ctrl.preview().id + '/edit]', {
          onclick: function() {
            m.route(this.getAttribute('href'));
            m.redraw.strategy('diff');
            return false;
          }
        }, 'Edit Note')
      ]),
      m('h1.note-title', ctrl.preview().title),
      m('.preview-content', m.trust(marked(ctrl.preview().content || '')))
    ]);
  }
};
