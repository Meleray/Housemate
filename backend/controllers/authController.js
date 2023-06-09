const userModel = require("../database/models/user");
const jwt = require("jsonwebtoken");

const genToken = (res, userId) => {
    const token = jwt.sign({ 
        userId 
    }, process.env.JWT_SECRET, {expiresIn: 43200});
  
    res.cookie("jwtToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 43200,
    });
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({ userEmail: email });
        if (user && (await user.checkPassword(password))) {
            genToken(res, user._id);
            res.status(200).json({
                message: "Successful authentication"
            })
        } else {
            return res.status(401).json({error: {type: "INVALID_CREDENTIALS", message: "Invalid email or password"}});
        }
    } catch(error) {
        return res.status(500).json({error: {type: "SERVER_ERROR", message: error.message}});
    } 
}

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: "Sucessful logout"})
}

module.exports = {login, logout};