const express = require('express');
// const bookmarks = require('./data');
const bookmarkRoutes = express.Router();
const winston = require('winston');
const uuid = require('uuid/v4');
const bookmarksService = require('./bookmarks-service');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'info.log'})
  ]
});

bookmarkRoutes.use(express.json());

bookmarkRoutes.route('/bookmarks')
  .get((req, res) => {
    console.log(req.app.db);
    res.json(bookmarksService.getAllBookmarks(req.app.db));
  });

  // .post ((req, res) => {
  //   const {title, content} = req.body;
  //   if (!title) {
  //     logger.error('Title is required');
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   }
  //   if (!content) {
  //     logger.error('Content is required');
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   }
  //   const id = uuid();

  //   const bookmark = {
  //     id,
  //     title,
  //     content
  //   };

  //   bookmarks.push(bookmark);

  //   logger.info(`Bookmark with id ${id} created`);
  //   res
  //     .status(201)
  //     .location(`http://localhost:8000/bookmarks/${id}`)
  //     .json(bookmark);
  // });


// bookmarkRoutes.route('/bookmarks/:id')
//   .get((req, res) => {
//     const bookmark = bookmarks.find(bm => bm.id === req.params.id);
//     if (!bookmark) {
//       logger.error(`Card with id ${req.params} not found`);
//       return res
//         .status(404)
//         .send('Card Not Found');
//     }

//     res.json(bookmark);
//   });
  // .delete((req, res) => {
  //   const id = req.params.bookmarkId;
  //   const bookmarkIndex = bookmarks.findIndex(bm => bm.id === id);

  //   if (bookmarkIndex === -1) {
  //     logger.error(`List with id ${id} not found.`);
  //     return res
  //       .status(404)
  //       .send('Not found');
  //   }
  //   bookmarks.splice(bookmarkIndex, 1);

  //   logger.info(`List with id ${id} deleted.`);
  //   res
  //     .status(204)
  //     .end();
  // });

module.exports = bookmarkRoutes;