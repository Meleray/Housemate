const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // for foreign keys

const SpaceSchema = new mongoose.Schema({

    spaceName: {
        type: String,
        required: true,
    },
    spaceMembers: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],

    spaceAdmins: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    premiumExpiration: Date,
});

SpaceSchema.set('versionKey', false);  // don't store {..., "__v":0}

const Space = mongoose.model("Space", SpaceSchema);
module.exports = Space;
