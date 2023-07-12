const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // for foreign keys

const MessageSchema = new mongoose.Schema({

    messageText: {
        type: String,
        minLength: 1,
        maxLength: 512,
        required: true,
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
    },
    date: {
        type: Date,
        required: true,
        index: true,
        default: () => Date.now()
    },
    isNotification: {
        type: Boolean,
        required: true,
        default: false
    }
});

MessageSchema.set('versionKey', false);  // don't store {..., "__v":0}

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
