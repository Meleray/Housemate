const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
    },
    userDescription: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userPicture: {
        type: Number,  // HEX colour
        required: true,
    },
    userSpacesId: {
        type: [Number],
        required: false,
    }

});

const User = mongoose.model("User", UserSchema);

module.exports = User;
