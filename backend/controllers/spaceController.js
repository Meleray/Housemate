const HttpStatus = require('http-status-codes');

const spaceService = require("../services/spaceService");

const getSpaceById = async (req, res) => {
    const space = await spaceService.getSpaceById(req.body);
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

    const spaceUpdated = await spaceService.addSpaceMember(
        {spaceId: space._id, userId: req.body.userId});

    if (spaceUpdated == null || spaceUpdated.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(spaceUpdated);
    }
    return res.status(HttpStatus.OK).json(spaceUpdated)
}

const getSpacesByUserId = async (req, res) => {
    const spaces = await spaceService.getSpacesByUserId(req.body);

    if (spaces == null || spaces.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(spaces);
    }
    return res.status(HttpStatus.OK).json(spaces)
}

const addSpaceMember = async (req, res) => {
    const space = await spaceService.addSpaceMember(req.body);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
};

const joinSpace = async (req, res) => {
    const space = await spaceService.joinSpace(req.body);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
};

const deleteSpaceMember = async (req, res) => {
    const space = await spaceService.deleteSpaceMember(req.body);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
}

const promoteToAdmin = async (req, res) => {
    const space = await spaceService.promoteToAdmin(req.body);

    if (space == null || space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(space);
    }
    return res.status(HttpStatus.OK).json(space)
}

const getInviteCode = async (req, res) => {
    const code = await spaceService.getInviteCode(req.body);

    if (code == null || code.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(code);
    }
    return res.status(HttpStatus.OK).json(code)
}

const changeInviteCode = async (req, res) => {
    const code = await spaceService.changeInviteCode(req.body);

    if (code == null || code.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(code);
    }
    return res.status(HttpStatus.OK).json(code)
}


module.exports = {
    getSpaceById,
    addSpace,
    createSpaceAndAddUser,
    getSpacesByUserId,
    addSpaceMember,
    joinSpace,
    deleteSpaceMember,
    promoteToAdmin,
    getInviteCode,
    changeInviteCode
};
