const { MongoClient } = require("mongodb");
require('dotenv').config();
const Db = 'mongodb+srv://raulcalzado:k7xtlP6XVWoPpWtA@cluster0.dntsyuz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//const Db = 'mongodb://localhost:27017';

const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
  connectToServer: async function (callback) {
    console.log("Connecting to MongoDB...")
    await client.connect();
    const databaseName = "Notion-like";
    console.log(databaseName)
    _db = client.db(databaseName);
    return _db;
  },
 
  getDb: function () {
    return _db;
  },
};