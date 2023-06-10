const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,  // Be careful - not a validator
        index: true,
        validate: {
            validator: function (value) {
                // RFC 5322
                let reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
                return reg.test(value);
            },
            message: "Invalid email address provided"
        }
    },
    userDescription: {
        type: String,
        maxlength: 1000,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userPicture: {
        type: Number,  // HEX colour
        required: true,
    },

});

UserSchema.methods.checkPassword = async function (pwd) {
    return await bcrypt.compare(pwd, this.userPassword);
};

UserSchema.set('versionKey', false);  // don't store {..., "__v":0}
UserSchema.plugin(uniqueValidator);  // Uniqueness validator. By default, mongoose does not check uniqueness

const User = mongoose.model("User", UserSchema);
module.exports = User;
