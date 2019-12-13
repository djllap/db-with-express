const express = require('express');
const bookmarkRoutes = express.Router();
const isURL = require('is-url');
const winston = require('winston');
const bookmarksService = require('./bookmarks-service');
const sanitizeBookmark = require('./sanitizeBookmark');
const { NODE_ENV } = require('../config');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'info.log'})
  ]
});

if (!['production', 'test'].includes(NODE_ENV)) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

bookmarkRoutes.use(express.json());

bookmarkRoutes.route('/bookmarks')
  .get((req, res, next) => {
    bookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => res.json(bookmarks.map(sanitizeBookmark)))
      .catch(next);
  })
  .post((req, res, next) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const { title, url, description, rating } = req.body;
    const ratingNum = parseInt(rating);

    if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send({
        error: { message: '\'rating\' must be a number between 0 and 5' }
      });
    }

    if (!isURL(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400).send({
        error: { message: '\'url\' must be a valid URL' }
      });
    }

    const newBookmark = { title, url, description, rating };

    bookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created.`);
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(sanitizeBookmark(bookmark));
      })
      .catch(next);
  });

bookmarkRoutes.route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params;
    bookmarksService.getById(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`);
          return res.status(404).json({
            error: { message: 'Bookmark Not Found' }
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(sanitizeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;
    bookmarksService.deleteBookmark(
      req.app.get('db'),
      bookmark_id
    )
      .then(numRowsAffected => {
        logger.info(`Bookmark with id ${bookmark_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarkRoutes;