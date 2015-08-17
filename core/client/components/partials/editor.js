var m = require('mithril');
var marked = require('../../marked');
var state = {};

module.exports = {
  controller: function(props) {
    props = props || {};
    state = props.state || {};

    var note = props.note || {};

    this.id = note.id || -1;
    this.title = m.prop(note.title || '');
    this.content = m.prop(note.content || '');
    this.isNew = this.id === -1;
  },
  view: function(ctrl) {
    return m('div.editor-wrapper', [
      m('section.editor-title', [
        m('input[type=text]', {
          tabindex: 1,
          value: ctrl.title(),
          placeholder: 'Your Note Title',
          onblur: function() {
            // If there is no title and we've blurred the input lets just
            // throw something in here...
            if (this.value.trim().length === 0) {
              ctrl.title('(Untitled)');
            }
          },
          onkeyup: function() {
            ctrl.title(this.value);
          }
        })
      ]),
      m('section.editor-actions', [
        m('ul.list-horizontal', [!ctrl.isNew ? m('li', [
            m('a.btn-delete[href=#delete]', {
              onclick: function(evt) {
                evt.preventDefault();
                m.request({
                  method: 'DELETE',
                  url: '/api/notes/' + ctrl.id,
                  background: true
                }).then(function() {
                  delete state.notes;
                  m.route('/');
                });
              }
            }, 'Delete')
          ]) : '',
          m('li', [
            m('a.btn-save[href=#save]', {
              tabindex: 3,
              onclick: function(evt) {
                evt.preventDefault();
                m.request({
                  method: (!ctrl.isNew ? 'PUT' : 'POST'),
                  url: '/api/notes' + (!ctrl.isNew ? '/' + ctrl.id : ''),
                  background: true,
                  data: {
                    title: ctrl.title(),
                    content: ctrl.content()
                  }
                }).then(function(note) {
                  if (ctrl.isNew && note.id) {
                    m.route('/notes/' + note.id + '/edit');
                  }
                }).then(function() {
                  alert('Note saved!');
                  delete state.notes;
                });
              }
            }, 'Save')
          ])
        ])
      ]),
      m('section.editor', [
        m('section.editor-markdown', [
          m('.floating-header', m('small', 'Markdown')),
          m('textarea', {
            tabindex: 2,
            value: ctrl.content(),
            onscroll: function() {
              // Calculate how much we should be scrolling the preview element;
              // We want to make sure things are always in view
              var scroll =
                this.scrollTop / (this.scrollHeight - this.offsetHeight);

              this.previewEl =
                this.previewEl || document.querySelector('.js-preview');

              this.previewEl.scrollTop =
                scroll * (this.previewEl.scrollHeight - this.previewEl.offsetHeight);
            },
            onkeyup: function() {
              ctrl.content(this.value);
            }
          })
        ]),
        m('section.editor-preview', [
          m('.floating-header', m('small', 'Preview')),
          m('section.preview-content.js-preview', [
            m.trust(marked(ctrl.content()))
          ])
        ])
      ])
    ]);
  }
};
