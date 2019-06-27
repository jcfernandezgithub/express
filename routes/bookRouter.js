const express = require('express');
const bookController = require('../controllers/bookController')

function routes(Book) {
  const bookRouter = express.Router();
  const controller = bookController(Book);

  //get all books
  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);
  //middleware
  bookRouter.use('/books/:bookId', (req, res, next) => {

    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  //find book by id
  bookRouter.route('/books/:bookId')
  
    //get call
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      returnBook.links = {};
      const genre = req.book.genre.replace(' ', '%20');
      returnBook.links.filterbygenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
      res.json(returnBook)
    })

    //put call
    .put((req, res) => {

      const { book } = req;
      book.title = req.body.title;
      book.genr = req.body.genre;
      book.author = req.body.author;
      book.read = req.body.read;

      //saving
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    //patch call
    .patch((req, res) => {
      const { book } = req;
      if (req.body._id) {
        delete req.body._id;
      }

      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });

      //saving
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    //delete call
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      })
    });

  return bookRouter;
}

module.exports = routes;