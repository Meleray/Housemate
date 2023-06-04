const spaceModel = require("../database/models/space");

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

    addSpace = async (space) => {
        await space.save();
    };
}

module.exports = new SpaceService();
