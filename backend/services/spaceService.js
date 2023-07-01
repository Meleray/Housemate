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
        if (!(await spaceModel.exists({_id: spaceId}))) {
            return {error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}};
        }
        if (!(await userModel.exists({_id: userId}))) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
        }

        return spaceModel.findByIdAndUpdate(spaceId,
            {$addToSet: {spaceMembers: userId}}, // update 'spaceMembers' only if userId is not presented in it
            {new: true}
        )
    };

    deleteSpaceMember = async (spaceId, userId) => {
        const space = await spaceModel.findByIdAndUpdate(spaceId, {
            $pull: {spaceMembers: userId}  // update 'spaceMembers' only if userId is not presented in it
        }, {new: true})
        if (!space) {
            return {
                error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}
            }
        }
        return space.save();
    };
}

module.exports = new SpaceService();
