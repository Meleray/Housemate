const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({

    spaceName: {
        type: String,
        required: true,
    },
    spaceMembers: [String],
    spaceAdmins: [String],
    premiumExpiration: Date,
});

SpaceSchema.set('versionKey', false);  // don't store {..., "__v":0}

const Space = mongoose.model("Space", SpaceSchema);
module.exports = Space;
