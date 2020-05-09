//@ts-check
//Mongo
const neo4j = require('neo4j-driver')
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/BookTrader";
const neouri="bolt://lim5.csse.rose-hulman.edu:7687"

class Database {
  constructor () {
    this.connectToMongo();
    // this.connectToNeo4j();
  }
  connectToMongo() {
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useFindAndModify: false
    }).then(() => {
      console.log('Database connection successful');
      console.log(`Mongoose connected to ${mongoURI}`);
    }).catch(err => {
      console.error(`Database connection error: ${err}`);
    });
  }

  connectToNeo4j() {
    const driver = neo4j.driver(neouri, neo4j.auth.basic("neo4j", "000201"));    
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


