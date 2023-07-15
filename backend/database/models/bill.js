const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const BillSchema = new mongoose.Schema({
    body: {
        type: String,
        maxlen: 1000
    },
    date: {
        type: Date,
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: "Space",
    },
    
});

UserSchema.set('versionKey', false);


const Bill = mongoose.model("Bill", BillSchema);
module.exports = {BillSchema};
