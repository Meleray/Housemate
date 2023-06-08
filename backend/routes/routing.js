const express = require('express');
const router = express.Router();
const { checkJWT } = require("../middleware/checkAuth");
const userController = require("../controllers/userController");
const spaceController = require("../controllers/spaceController");
const chatController = require("../controllers/chatController");

const authRouter = require("./subsystems/authRouter");

// Database OPs
router.get("/find-user", checkJWT, userController.getUserById);
router.post("/add-user", userController.addUser);
router.put("/update-user", checkJWT, userController.updateUser);
router.delete("/delete-user", checkJWT, userController.deleteUser);
router.put("/add-space-member", checkJWT, userController.addUserToSpace);
router.delete("/delete-space-member", checkJWT, userController.deleteUserFromSpace);
router.get("/find-spaces-by-userid", checkJWT, userController.getSpacesByUserId);

// Space OPs
router.get("/find-space", checkJWT, spaceController.getSpaceById);
router.post("/add-space", checkJWT, spaceController.addSpace);

// Chat Subsystem OPs
router.get("/find-chat", checkJWT, chatController.getChatById);
router.post("/add-chat", checkJWT, chatController.addChat);

router.use("/auth", authRouter)

module.exports = router
