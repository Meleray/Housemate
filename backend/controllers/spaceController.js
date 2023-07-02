const HttpStatus = require('http-status-codes');

const spaceService = require("../services/spaceService");

const getSpaceById = async (req, res) => {
    const spaceId = req.body.spaceId;
    const space = await spaceService.getSpaceById(spaceId);
    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space);
};

const addSpace = async (req, res) => {
    const space = await spaceService.addSpace(req.body)
    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space);
};

const createSpaceAndAddUser = async (req, res) => {
    let spaceData = structuredClone(req.body)
    delete spaceData.userId
    const space = await spaceService.addSpace(spaceData)

    const userId = req.body.userId;
    const spaceUpdated = await spaceService.addSpaceMember(space._id, userId);

    if (spaceUpdated == null || spaceUpdated.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(spaceUpdated);
    }
    return res.status(HttpStatus.OK).json(spaceUpdated)
}

const getSpacesByUserId = async (req, res) => {
    const userId = req.body.userId;
    const spaces = await spaceService.getSpacesByUserId(userId);

    if (spaces == null || spaces.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(spaces);
    }
    return res.status(HttpStatus.OK).json(spaces)
}

const addSpaceMember = async (req, res) => {
    const userId = req.body.userId;
    const spaceId = req.body.spaceId;
    const space = await spaceService.addSpaceMember(spaceId, userId);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
};

const deleteSpaceMember = async (req, res) => {
    const userId = req.body.userId;
    const spaceId = req.body.spaceId;
    const space = await spaceService.deleteSpaceMember(spaceId, userId);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
}

const promoteToAdmin = async (req, res) => {
    const userId = req.body.userId;
    const spaceId = req.body.spaceId;
    const space = await spaceService.promoteToAdmin(spaceId, userId);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
}

module.exports = {
    getSpaceById,
    addSpace,
    createSpaceAndAddUser,
    getSpacesByUserId,
    addSpaceMember,
    deleteSpaceMember,
    promoteToAdmin
};
