const userService = require("../services/userService");
const userModel = require("../database/models/user");

const getUserById = async (req, res) => {
    const userId = req.body.userId;
    const profileDetails = await userService.getUserById(userId);
    if (profileDetails.error) {
        return res.status(404).json({error: profileDetails.error});
    }
    res.status(200).json(profileDetails);
};

const addUser = async (req, res) => {
    //this controller function uses the course service to add a course to a database
    try {
        const user = new userModel(req.body);
        userService.addUser(user)

        res
            .status(200)
            .json({ message: "A user added successfully", response: user });
    } catch (error) {
        console.log(`Error while adding a user`, error.message);
        res.status(400).json({ error: "Error while adding a user" });
    }
};



module.exports = {getUserById, addUser};
