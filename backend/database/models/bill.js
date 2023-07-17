const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const BillSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlen: 50,
        required: true,
    },
    body: {
        type: String,
        maxlen: 300,
        default: ""
    },
    spaceId: {
        type: Schema.Types.ObjectId,
        ref: "Space",
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
        default: () => Date.now()
    },
    reporterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    totalSum: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: "Negative bill sum"
        }
    }
});

BillSchema.set('versionKey', false);


const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
