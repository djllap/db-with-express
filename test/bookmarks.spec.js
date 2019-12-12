const knex = require('knex');
const app = require('../src/app');
const makeBookmarks = require('./bookmarks.fixtures');

describe.only('bookmarks endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('clean the table', () => db('bookmarks').truncate());
  afterEach('cleanup', () => db('bookmarks').truncate());
  
  describe('GET /bookmarks', () => {
    context('given there are bookmarks in the db', () => {
      const testBookmarks = makeBookmarks();

      beforeEach('insert articles', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });

      it('responds with 200 and all of the bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testBookmarks);
      });
    });

    context('given there is no data', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  describe('GET /bookmarks/:id', () => {
    context('given there is a bookmark of said ID', () => {
      const testBookmarks = makeBookmarks();

      beforeEach('insert articles', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });

      it('responds with 200 and the specified bookmark', () => {
        const id = 2;
        const expectedBM = testBookmarks[id - 1];

        return supertest(app)
          .get(`/bookmarks/${id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedBM);
      });
    });

    context('Given there is a matching bookmark', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get('/bookmarks/12')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404);
      });
    });
  });
});