const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    // need to add validation for email
    // validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    // match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },

});

const User = mongoose.model("User", UserSchema);

module.exports = User;
