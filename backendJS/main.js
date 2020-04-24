require('./dbConnection');
require('mongoose');
const request = require('request');
let User = require('./Schemas/User');
let Book = require('./Schemas/Book')

const express = require('express'),
    router = express.Router();

let newUser = User({
    name: 'test_name',
    username: 'test_username',
    email: 'test@test.com'
});


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
  
router.route('/users')
    .get((req, res, next) => {
        User.find({}, (err, users) => {
            if (err) {
                res.status(400);
                handleError(err, res, 'Could not find any users.');
                return;
            } else {
                res.status(200);
                res.json(users);
            }
        });
    }).post((req, res) => {
        // console.log(req);
        User.create({    
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        }, (err, user) => {
            if (err) {
                res.status(400);
                handleError(err, res, 'Error creating uesr.');
                return;
            } else {
                res.status(201);
                res.json(user);
            }
        });
    });

router.route('/users/:username')
    .get((req, res, next) => {
        User.findOne({'username': req.params.username}, function (err, user) {
            if (err) {
                res.status(404);
                handleError(new Error(), res, "Invalid username provided");
            } else {
                res.json(user);
            }
        });
    })
    // UPDATE a user by username
    /*  [Middleware] Use containsName middleware in this
        new version of update that queries the database once. 
        Introduces null values in database.
    */
    .put(containsName, (req, res) => {
        // console.log(req)
        User.findOneAndUpdate(
            {"username": req.username},
            {
                $set: {
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email
                }
            },
            // update multiple fields, return updated document in response
            {multi: true, new: true}
        )
            .exec((err, user) => {
                if (err) {
                    res.status(404);
                    handleError(err, res, 'Problem updating user');
                } else {
                    res.json(user);
                }
            });
    })

    // DELETE a user by username
    /*  [Middleware] Use containsName middleware */
    .delete(containsName, (req, res) => {
        User.findOneAndRemove({"username": req.username})
            .exec((err) => {
                if (err) {
                    res.status(404);
                    handleError(err, res, 'Problem deleting user');
                } else {
                    res.status(204);
                    res.json(null);
                }
            });
    });

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
        Book.create({    
            title: req.body.title,
            author: req.body.author,
            isbn: req.body.isbn
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

router.route('/books/:isbn')
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
    // UPDATE a book by isbn
    /*  [Middleware] Use containsISBN middleware in this
        new version of update that queries the database once. 
        Introduces null values in database.
    */
    .put(containsISBN, (req, res) => {
        // console.log(req)
        Book.findOneAndUpdate(
            {"isbn": req.isbn},
            {
                $set: {
                    title: req.body.title,
                    author: req.body.author,
                    isbn: req.body.isbn
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

    // DELETE a book by isbn
    /*  [Middleware] Use containsISBN middleware */
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

function containsName(req, res, next) {
    if (!req.params || !req.params.username) {
        res.status(404);
        handleError(new Error(), res, "Invalid Name provided");
    } else {
        console.log("containsName called!");
        req.username = req.params.username;
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