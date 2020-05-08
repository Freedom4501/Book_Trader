const express = require('express');
const bodyParser = require('body-parser');
const dbRoutes = require('./main');
const PouchDB = require('pouchdb');
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