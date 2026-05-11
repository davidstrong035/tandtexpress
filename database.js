let mongoose = require("mongoose");

class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(
        "mongodb://adminsector:AAAaaa111@cluster0-shard-00-00.dkwwo.mongodb.net:27017,cluster0-shard-00-01.dkwwo.mongodb.net:27017,cluster0-shard-00-02.dkwwo.mongodb.net:27017/tandexpress?ssl=true&replicaSet=atlas-ba5khr-shard-0&authSource=admin&retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      )
      .then(() => {
        console.log(
          "Database connection to T&T Express Delivery successful"
        );
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Database();
