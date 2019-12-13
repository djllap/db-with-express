const xss = require('xss');

const sanitizeBookmark = (bookmark) => ({
  id:  bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: parseInt(bookmark.rating)
});

module.exports = sanitizeBookmark;