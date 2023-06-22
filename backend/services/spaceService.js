const spaceModel = require("../database/models/space");

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

    addSpace = async (spaceData) => {
        return spaceModel.create(spaceData);
    };
}

module.exports = new SpaceService();
