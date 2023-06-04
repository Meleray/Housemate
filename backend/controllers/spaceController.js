const HttpStatus = require('http-status-codes');

const spaceService = require("../services/spaceService");
const spaceModel = require("../database/models/space");

const getSpaceById = async (req, res) => {
    const spaceId = req.body.spaceId;
    const profileDetails = await spaceService.getSpaceById(spaceId);
    if (profileDetails.error) {
        return res.status(HttpStatus.BAD_REQUEST).json({error: profileDetails.error});
    }
    res.status(HttpStatus.OK).json(profileDetails);
};

const addSpace = async (req, res) => {
    const space = new spaceModel(req.body);
    await spaceService.addSpace(space)

    res
        .status(HttpStatus.OK)
        .json({message: "A space added successfully", response: space});
};


module.exports = {getSpaceById, addSpace};
