const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // for foreign keys

const ChatSchema = new mongoose.Schema({

    chatName: {
        type: String,
        required: true,
    },
    chatPicture: {
        type: Number,  // HEX colour
        required: true,
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space',
        required: true
    },
    chatMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
});

ChatSchema.set('versionKey', false);  // don't store {..., "__v":0}

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
