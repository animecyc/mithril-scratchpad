var marked = require('marked');

// Set options to closely resemble Github Flavored Markdown (GFM)
marked.setOptions({
  gfm: true,
  breaks: true
});

module.exports = marked;
