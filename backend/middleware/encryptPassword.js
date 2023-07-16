const bcrypt = require("bcryptjs")


function encryptPassword(req, res, next) {
    if (req.body.userPassword) {
        const saltRounds = 10;
        try {
            req.body.userPassword = bcrypt.hashSync(req.body.userPassword, saltRounds);
        } catch(error) {
            return res.status(500).json({error: {type: "SERVER_ERROR", message: "Encryption error"}})
        }
    }
    next();
}

module.exports = { encryptPassword };