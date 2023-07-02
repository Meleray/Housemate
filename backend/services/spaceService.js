const spaceModel = require("../database/models/space");
const userModel = require("../database/models/user");

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

    getSpacesByUserId = async (userId) => {
        return spaceModel.find({spaceMembers: userId})
    }

    addSpace = async (spaceData) => {
        return spaceModel.create(spaceData);
    };

    addSpaceMember = async (spaceId, userId) => {
        // check user exist
        if (!(await userModel.exists({_id: userId}))) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
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
}

module.exports = new SpaceService();
