const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // for foreign keys

const SpaceSchema = new mongoose.Schema({

    spaceName: {
        type: String,
        required: true,
    },

    spaceMembers: [
        {
            _id: false, // Stop Mongoose from creating _id property for sub-document
            memberId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            isAdmin: {
                type: Boolean,
                default: false
            }
        }
    ],

    premiumExpiration: Date,
});

SpaceSchema.set('versionKey', false);  // don't store {..., "__v":0}

const Space = mongoose.model("Space", SpaceSchema);
module.exports = Space;
