const express = require('express');
const router = express.Router();
const { checkJWT } = require("../middleware/checkAuth");
const { encryptPassword } = require("../middleware/encryptPassword");
const userController = require("../controllers/userController");
const spaceController = require("../controllers/spaceController");
const chatController = require("../controllers/chatController");
const taskController = require("../controllers/taskController");
const messageController = require("../controllers/messageController");


const authRouter = require("./subsystems/authRouter");

// Database OPs

router.get("/find-user", checkJWT, userController.getUserById);
router.post("/add-user", encryptPassword ,userController.addUser);
router.put("/update-user", checkJWT, encryptPassword, userController.updateUser);
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
router.put("/add-chat-member", checkJWT, chatController.addChatMember)

// Task OPs
router.post("/add-task", checkJWT ,taskController.addTask);
router.post("/find-task", checkJWT ,taskController.getTaskById);


router.use("/auth", authRouter)

module.exports = router
