var m = require('mithril');

function onItemClick(evt) {
  var activeEls = [].slice.call(document.querySelectorAll('.page-header li.active'));

  activeEls.forEach(function(el) {
    el.classList.remove('active');
  });

  this.parentNode.classList.add('active');

  m.route(this.getAttribute('href'));

  if (activeEls.length) {
    m.redraw.strategy('diff');
  }

  return false;
}

module.exports = function(subtree) {
  return [
    m('.page-header', [
      m('.branding', '#scratchpad'),
      m('ul.list-horizontal', [
        m('li', {
          className: (/^\/(notes\/(?!.*edit).*)?$/.test(m.route()) ? 'active' : '')
        }, m('a[href=/]', {
          onclick: onItemClick
        }, 'Notes')),
        m('li', {
          className: (/^\/editor$/.test(m.route()) ? 'active' : '')
        }, m('a[href=/editor]', {
          onclick: onItemClick
        }, 'New Note'))
      ])
    ]),
    m('.content-wrapper', subtree)
  ];
};
