require('./dbConnection');
require('mongoose');
require('neo4j-driver');
const request = require('request');
let Book = require('./Schemas/Book');

const express = require('express'),
    router = express.Router();


const methodOverride = require('method-override');
router.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

function handleError(err, res, msg) {
    err.message = `${err.message} ${msg}`;
    err.status = res.statusCode;
    res.json(err);
}

const logger = require("morgan");
router.use(logger("dev"));
  

router.route('/books')
    .get((req, res, next) => {
        Book.find({}, (err, books) => {
            if (err) {
                res.status(400);
                handleError(err, res, 'Could not find any books.');
                return;
            } else {
                res.status(200);
                res.json(books);
            }
        });
    }).post((req, res) => {
        // console.log(req);
        var authors = req.body.author;
        var author_arr = authors.split(",");
        var existed = false;

        Book.create({    
            title: req.body.title,
            author: author_arr,
            isbn: req.body.isbn,
            price: req.body.price
        }, (err, book) => {
            if (err) {
                res.status(400);
                handleError(err, res, 'Error creating book.');
                return;
            } else {
                res.status(201);
                res.json(book);
            }
        });
    });

router.route('/books/sort/title')
    .get((req, res, next) => {
        Book.find({}, null, {sort: { "title": 1 }}, (err, books) => {
            if (err) {
                res.status(400);
                handleError(err, res, 'Could not find any books.');
                return;
            } else {
                res.status(200);
                res.json(books);
            }
        });
    })

router.route('/books/sort/price')
    .get((req, res, next) => {
        Book.find({}, null, {sort: { "price": 1 }}, (err, books) => {
            if (err) {
                res.status(400);
                handleError(err, res, 'Could not find any books.');
                return;
            } else {
                res.status(200);
                res.json(books);
            }
        });
    })

router.route('/books/isbn/:isbn')
    .get((req, res, next) => {
        Book.findOne({'isbn': req.params.isbn}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid isbn provided");
                
            } else {
                res.json(book);
            }
        });
    })
    .put(containsISBN, (req, res) => {
        // console.log(req)
        var authors = req.body.author;
        var author_arr = authors.split(", ");
        Book.findOneAndUpdate(
            {"isbn": req.isbn},
            {
                $set: {
                    title: req.body.title,
                    author: author_arr,
                    isbn: req.body.isbn,
                    price: req.body.price
                }
            },
            // update multiple fields, return updated document in response
            {multi: true, new: true}
        )
            .exec((err, book) => {
                if (err) {
                    res.status(404);
                    handleError(err, res, 'Problem updating book');
                } else {
                    res.json(book);
                }
            });
    })
    .delete(containsISBN, (req, res) => {
        Book.findOneAndRemove({"isbn": req.isbn})
            .exec((err) => {
                if (err) {
                    res.status(404);
                    handleError(err, res, 'Problem deleting book');
                } else {
                    res.status(204);
                    res.json(null);
                }
            });
    });
router.route('/books/title/:title')
    .get((req, res, next) => {
        Book.find({'title': req.params.title}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid title provided");
                
            } else {
                res.json(book);
            }

        });
    })
    .put(containsTitle, (req, res) => {
        Book.findOneAndUpdate(
            {"title": req.title},
            {
                $set: {
                    title: req.body.title,
                    author: req.body.author,
                    isbn: req.body.isbn
                }
            },
            {multi: true, new: true}
        )
            .exec((err, book) => {
                if (err) {
                    res.status(404);
                    handleError(err, res, 'Problem updating book');
                } else {
                    res.json(book);
                }
            });
    })

    .delete(containsTitle, (req, res) => {
        Book.findOneAndRemove({"title": req.title})
            .exec((err) => {
                if (err) {
                    res.status(404);
                    handleError(err, res, 'Problem deleting book');
                } else {
                    res.status(204);
                    res.json(null);
                }
            });
    });

router.route('/books/title/:title/sort/title')
    .get((req, res, next) => {
        Book.find({'title': req.params.title}, null, {sort: { "title": 1 }}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid title provided");
                
            } else {
                res.json(book);
            }

        });
    });
router.route('/books/title/:title/sort/price')
    .get((req, res, next) => {
        Book.find({'title': req.params.title}, null, {sort: { "price": 1 }}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid title provided");
                
            } else {
                res.json(book);
            }

        });
    });

router.route('/books/author/:author')
    .get((req, res, next) => {
        Book.find({'author': req.params.author}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid author provided");
            } else {
                res.json(book);
            }
        });
    });

router.route('/books/author/:author/sort/title')
    .get((req, res, next) => {
        Book.find({'author': req.params.author}, null, {sort: { "title": 1 }}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid author provided");
            } else {
                res.json(book);
            }
        });
    });

router.route('/books/author/:author/sort/price')
    .get((req, res, next) => {
        Book.find({'author': req.params.author}, null, {sort: { "price": 1 }}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid author provided");
            } else {
                res.json(book);
            }
        });
    });

router.route('/books/gt/:gt/lt/:lt')
    .get((req, res, next) => {
        Book.find({$and: [{"price":{$gt:req.params.gt}},{"price":{$lt:req.params.lt}}]}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid author provided");
            } else {
                res.json(book);
            }
        });
    });

router.route('/books/gt/:gt/lt/:lt/sort/title')
    .get((req, res, next) => {
        Book.find({$and: [{"price":{$gt:req.params.gt}},{"price":{$lt:req.params.lt}}]}, null, {sort: { "title": 1 }}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid author provided");
            } else {
                res.json(book);
            }
        });
    });

router.route('/books/gt/:gt/lt/:lt/sort/price')
    .get((req, res, next) => {
        Book.find({$and: [{"price":{$gt:req.params.gt}},{"price":{$lt:req.params.lt}}]}, null, {sort: { "price": 1 }}, function (err, book) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid author provided");
            } else {
                res.json(book);
            }
        });
    });

function containsTitle(req, res, next) {
    if (!req.params || !req.params.title) {
        res.status(404);
        handleError(new Error(), res, "Invalid Title provided");
    } else {
        console.log("containsName called!");
        req.title = req.params.title;
        next();
    }
}

function containsISBN(req, res, next) {
    if (!req.params || !req.params.isbn) {
        res.status(404);
        handleError(new Error(), res, "Invalid isbn provided");
    } else {
        console.log("containsISBN called!");
        req.isbn = req.params.isbn;
        next();
    }
}


module.exports = router;