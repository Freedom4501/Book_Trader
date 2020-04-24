//@ts-check

var rh = rh || {};

var client = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/BookTrader", function(err, db){
  if(!err){
    console.log("Connected to Mongo");
  }

  db.createCollection('user', function(err, collection) {});
});


async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

class User {
  constructor(name, uname, pass, address, phone){
    this.name = name;
    this.uname = uname;
    this.pass = pass;
    this.address = address;
    this.phone = phone;
  }
}


