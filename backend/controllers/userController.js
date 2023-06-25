const HttpStatus = require('http-status-codes');

const userService = require("../services/userService");

const getUserById = async (req, res) => {
    const userId = req.body.userId;
    const user = await userService.getUserById(userId);
    if (user == null || user.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(user);
    }
    return res.status(HttpStatus.OK).json(user);
};

const addUser = async (req, res) => {
    const user = await userService.addUser(req.body);
    if (user == null || user.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(user);
    }
    return res.status(HttpStatus.OK).json(user);
};

const updateUser = async (req, res) => {
    const updatedUser = await userService.updateUser(req.body)
    return res.status(HttpStatus.OK).json(updatedUser);
}

const deleteUser = async (req, res) => {
    const userId = req.body.userId;
    const deletedUser = await userService.deleteUser(userId);
    if (deletedUser == null || deletedUser.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(deletedUser);
    }
    return res.status(HttpStatus.OK).json(deletedUser)
};

module.exports = {getUserById, addUser, updateUser, deleteUser};
