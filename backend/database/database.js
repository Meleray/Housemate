const mongoose = require("mongoose");
const MONGO_DB_URL = "mongodb://houseApp:housePass@localhost:27017/houseDB?retryWrites=true&w=majority";

class Database {
  connect = async () => {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.set('strictQuery', true);
    mongoose
      .connect(MONGO_DB_URL, connectionParams)
      .then(() => {
        console.log("Connected to the database ");
      })
      .catch((err) => {
        console.error("Error while connecting to the database", err);
      });
  };
}

module.exports = new Database();
