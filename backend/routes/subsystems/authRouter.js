const authController = require("../../controllers/authController");
const express = require("express");
const authRouter = express.Router();


authRouter.post("/login", authController.login)
authRouter.post("/logout", authController.logout)

module.exports = authRouter