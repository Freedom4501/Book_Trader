const express = require('express');
const bodyParser = require('body-parser');
const dbRoutes = require('./main');
const app = express();
require('./dbConnection');

app.use(require("cors") ())
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;
app.get('/', (req, res) => {
    //commentout line to see waiting status on server
    res.send('Hello World');
});
app.use('/db', dbRoutes);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

var PouchDB = require("pouchdb");
 
var couchdb = new PouchDB("http://lim5:000201@137.112.104.118:5984/users");
var server = app.listen(3001, function() {
    couchdb.info().then(function(info) {
        console.log(info);
        console.log("Listening on port %s...", server.address().port);
    });
});