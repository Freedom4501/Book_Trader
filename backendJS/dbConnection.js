//@ts-check
//Mongo
const mongoose = require('mongoose');
dbURI = "mongodb://localhost:27017/BookTrader";

//CouchDB

class Database {
  constructor () {
    this.connectToDB();
  }
  connectToDB() {
    mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useFindAndModify: false
    }).then(() => {
      console.log('Database connection successful');
      console.log(`Mongoose connected to ${dbURI}`);
    }).catch(err => {
      console.error(`Database connection error: ${err}`);
    });
  }
}
module.exports = new Database();
// var rh = rh || {};

// var client = require('mongodb').MongoClient;

// MongoClient.connect("mongodb://localhost:27017/BookTrader", function(err, db){
//   if(!err){
//     console.log("Connected to Mongo");
//   }

//   db.createCollection('user', function(err, collection) {});
// });


// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();
//   console.log("Databases:");
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

// class User {
//   constructor(name, uname, pass, address, phone){
//     this.name = name;
//     this.uname = uname;
//     this.pass = pass;
//     this.address = address;
//     this.phone = phone;
//   }
// }


