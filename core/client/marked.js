var marked = require('marked');

marked.setOptions({
  gfm: true,
  breaks: true
});

module.exports = marked;
