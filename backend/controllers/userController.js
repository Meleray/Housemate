const userService = require("../services/userService");
const userModel = require("../database/models/user");

const getProfile = async (req, res) => {
    const email = req.body.email;
    const profileDetails = await userService.getProfile(email);
    if (profileDetails.error) {
        return res.status(404).json({error: profileDetails.error});
    }
    res.status(200).json(profileDetails);
};

const addProfile = async (req, res) => {
    //this controller function uses the course service to add a course to a database
    try {
        const user = new userModel(req.body);
        userService.addProfile(user)

        res
            .status(200)
            .json({ message: "A user added successfully", response: user });
    } catch (error) {
        console.log(`Error while adding a user`, error.message);
        res.status(400).json({ error: "Error while adding a user" });
    }
};



module.exports = {getProfile, addProfile};
