const userModel = require("../database/models/user");
const jwt = require("jsonwebtoken");

const genToken = (res, userId) => {
    const token = jwt.sign({ 
        userId 
    }, process.env.JWT_SECRET, {expiresIn: 24 * 60 * 60 * 1000});
  
    res.cookie("HousemateCookie", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
};

const login = async (req, res) => {
    const {userEmail, userPassword} = req.body;
    try {
        const user = await userModel.findOne({ userEmail });
        if (user && (await user.checkPassword(userPassword))) {
            genToken(res, user._id);
            res.status(200).json({
                message: "Successful authentication",
                userId: user._id
            });
        } else {
            return res.status(401).json({error: "Invalid email or password"});
        }
    } catch(error) {
        return res.status(500).json({error: error.message});
    } 
}

const logout = async (req, res) => {
    res.cookie("HousemateCookie", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({message: "Sucessful logout"})
}

module.exports = {login, logout};
