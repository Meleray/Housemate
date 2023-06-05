const HttpStatus = require('http-status-codes');

const spaceService = require("../services/spaceService");

const getSpaceById = async (req, res) => {
    const spaceId = req.body.spaceId;
    const space = await spaceService.getSpaceById(spaceId);
    if (space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json({error: space.error});
    }
    return res.status(HttpStatus.OK).json(space);
};

const addSpace = async (req, res) => {
    const space = await spaceService.addSpace(req.body)
    if (space.error) {
        return res.status(HttpStatus.BAD_REQUEST).json({error: space.error});
    }
    return res.status(HttpStatus.OK).json({message: "A space added successfully", response: space});
};


module.exports = {getSpaceById, addSpace};
