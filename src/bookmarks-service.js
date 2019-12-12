const bookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks');
  },

  getBookmarkByID(knex, id) {
    return knex.select('*')
      .from('bookmarks')
      .where('id', id)
      .first();
  }
};

module.exports = bookmarksService;