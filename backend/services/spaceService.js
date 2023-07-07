const spaceModel = require("../database/models/space");
const userModel = require("../database/models/user");
const {randomInviteCode} = require("./utilsForServices");

class SpaceService {
    getSpaceById = async (spaceId) => {
        const space = await spaceModel.findById(spaceId);
        if (!space) {
            return {
                error: {type: "SPACE_NOT_FOUND", message: "There is no space for this id"},
            };
        }
        return space;
    };

    getSpacesByUserId = async (userId) => {  // TODO
        return spaceModel.find({'spaceMembers.memberId': userId})
    }

    addSpace = async (spaceData) => {
        spaceData.inviteCode = randomInviteCode()
        return spaceModel.create(spaceData);
    };

    addSpaceMember = async (spaceId, userId) => {
        // check user exist
        if (!(await userModel.exists({_id: userId}))) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user with id=${userId}`}};
        }
        if (!(await spaceModel.exists({_id: spaceId}))) {
            return {error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}};
        }
        if ((await spaceModel.exists(
            {$and: [{_id: spaceId}, {spaceMembers: {"$in": [{memberId: userId}]}}]}
        ))) {
            return {
                error: {
                    type: "FAILED_TO_ADD_MEMBER", message: `There user ${userId} is already a member of ${spaceId}`
                }
            };
        }

        return spaceModel.findByIdAndUpdate(spaceId,
            {$push: {spaceMembers: {memberId: userId}}},
            {new: true}
        )
    };

    joinSpace = async (inviteCode, userId) => {
        let spaceId = await spaceModel.findOne({inviteCode: inviteCode})
        if (spaceId === null) {
            return {error: {type: "INVALID_INVITE_CODE", message: `The code ${inviteCode} is invalid`}}
        }
        return this.addSpaceMember(spaceId, userId)
    }

    deleteSpaceMember = async (spaceId, userId) => {
        const space = await spaceModel.findByIdAndUpdate(spaceId, {
            $pull: {spaceMembers: {memberId: userId}}  // update 'spaceMembers' only if userId is not presented in it
        }, {new: true})
        if (!space) {
            return {
                error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}
            }
        }
        return space.save();
    };

    promoteToAdmin = async (spaceId, userId) => { //demoteFromAdmin
        // check user exist
        if (!(await spaceModel.exists({_id: spaceId, spaceMembers: {"$in": [{memberId: userId}]}}))) {
            return {
                error: {type: "FAILED_TO_UPGRADE_TO_ADMIN", message: `The user ${userId} is not a member of ${spaceId}`}
            };
        }

        let filter = {_id: spaceId, spaceMembers: {memberId: userId}}
        // '$' operator identifies an element in an array to update without explicitly specifying the position
        // https://www.mongodb.com/docs/manual/reference/operator/update/positional/
        let update = {$set: {'spaceMembers.$.isAdmin': true}}

        return spaceModel.findOneAndUpdate(filter, update, {new: true})
    };

    getInviteCode = async (spaceId) => {
        return spaceModel.findById(spaceId).select("inviteCode");
    }

    changeInviteCode = async (spaceId) => {
        const newInviteCode = randomInviteCode()
        return spaceModel.findByIdAndUpdate(
            spaceId,
            {inviteCode: newInviteCode},
            {new: true}).select("inviteCode");
    }
}


module.exports = new SpaceService();
