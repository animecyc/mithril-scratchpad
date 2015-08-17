var m = require('mithril');

module.exports = {
  controller: function(props) {
    props = props || {};
    this.notes = m.prop(props.notes || []);
  },
  view: function(ctrl) {
    return m('.notes-list', [
      m('.floating-header', [
        m('small', 'Notes')
      ]),
      m('.notes-list-entries', [
        m('ol.entries', [
          ctrl.notes().map(function(note) {
            return m('li.entry', [
              m('a[href=/notes/' + note.id + ']', {
                config: m.route
              }, [
                m('h3.entry-title', note.title)
              ])
            ]);
          })
        ])
      ])
    ]);
  }
};
