const HttpStatus = require('http-status-codes');

const userService = require("../services/userService");
const userModel = require("../database/models/user");
const spaceService = require("../services/spaceService");
const {getSpaceById} = require("./spaceController");

const getUserById = async (req, res) => {
    const userId = req.body.userId;
    const user = await userService.getUserById(userId);
    if (user.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(user);
    }
    return res.status(HttpStatus.OK).json(user);
};

const addUser = async (req, res) => {
    const user = new userModel(req.body);
    await userService.addUser(user)

    return res.status(HttpStatus.OK).json({message: "A user added successfully", response: user});
};

const updateUser = async (req, res) => {
    const user = new userModel(req.body);
    await userService.updateUser(user)

    return res.status(HttpStatus.OK).json({message: "A user updated successfully", response: user});
}
const getSpacesByUserId = async (req, res) => {
    const userId = req.body.userId;
    const spaceIds = await userService.getSpacesByUserId(userId);
    return res.status(HttpStatus.OK).json(spaceIds);
};

const deleteUser = async (req, res) => {
    const userId = req.body.userId;
    const deletedUser = await userService.deleteUser(userId);
    if (deletedUser.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(deletedUser);
    }
    return res.status(HttpStatus.OK).json(deletedUser)
};

const addUserToSpace = async (req, res) => {
    const userId = req.body.userId;
    const spaceId = req.body.spaceId;
    const spaceIds = await userService.addUserToSpace(userId, spaceId);

    if (spaceIds.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(spaceIds);
    }
    return res.status(HttpStatus.OK).json(spaceIds)
};

const deleteUserFromSpace = async (req, res) => {
    const userId = req.body.userId;
    const spaceId = req.body.spaceId;
    const spaceIds = await userService.deleteUserFromSpace(userId, spaceId);

    if (spaceIds.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(spaceIds);
    }
    return res.status(HttpStatus.OK).json(spaceIds)
}

module.exports = {getUserById, addUser, updateUser, getSpacesByUserId, deleteUser, addUserToSpace, deleteUserFromSpace};
