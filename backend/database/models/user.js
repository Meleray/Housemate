const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
    },
    userDescription: String,
    userPassword: {
        type: String,
        required: true,
    },
    userPicture: {
        type: Number,  // HEX colour
        required: true,
    },

});

UserSchema.set('versionKey', false);  // don't store {..., "__v":0}

const User = mongoose.model("User", UserSchema);
module.exports = User;
