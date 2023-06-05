const spaceModel = require("../database/models/space");
const userModel = require("../database/models/user");

class SpaceService {
    getSpaceById = async (spaceId) => {
        const space = await spaceModel.findById(spaceId);
        if (!space) {
            return {
                error: {
                    type: "PROFILE_NOT_FOUND",
                    message: "There is no profile for this id",
                },
            };
        }
        return space;
    };

    addSpace = async (spaceData) => {
        try {
            return await spaceModel.create(spaceData);
        } catch(err) {
            return {error: {type: "FAILED_TO_ADD_SPACE", message: err.message}};
        }
    };
}

module.exports = new SpaceService();
