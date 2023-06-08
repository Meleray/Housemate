const mongoose = require("mongoose");

class Database {
  connect = async () => {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.set('strictQuery', true);
    mongoose
      .connect(process.env.MONGODB_URL, connectionParams)
      .then(() => {
        console.log("Connected to the database ");
      })
      .catch((err) => {
        console.error("Error while connecting to the database", err);
      });
  };
}

module.exports = new Database();
