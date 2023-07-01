const express = require('express');
const router = express.Router();
const {checkJWT} = require("../middleware/checkAuth");
const {encryptPassword} = require("../middleware/encryptPassword");
const userController = require("../controllers/userController");
const spaceController = require("../controllers/spaceController");
const chatController = require("../controllers/chatController");
const messageController = require("../controllers/messageCotroller");
const taskController = require("../controllers/taskController");

const authRouter = require("./subsystems/authRouter");

const handleErrorAsync = func => async (req, res, next) => {
    /*
    An additional wrapping function like this is the only way to catch an async exceptions in Express.js
    and pass them further for responding to client with an error.
    You can catch exceptions with `process.on('uncaughtException', function(err) {...});`,
    but in this case you are not able to send a response.
    https://stackoverflow.com/questions/43356705/node-js-express-error-handling-middleware-with-router
    */
    try {
        await func(req, res, next);
    } catch (error) {
        next(error);
    }
};

// Database OPs
router.post("/find-user", checkJWT, handleErrorAsync(userController.getUserById));
router.post("/create-user", encryptPassword, handleErrorAsync(userController.addUser));
router.put("/update-user", checkJWT, encryptPassword, handleErrorAsync(userController.updateUser));
router.delete("/delete-user", checkJWT, handleErrorAsync(userController.deleteUser));

// Space OPs
router.post("/find-space", checkJWT, handleErrorAsync(spaceController.getSpaceById));
router.post("/create-space", checkJWT, handleErrorAsync(spaceController.addSpace));
router.put("/create-space-member", checkJWT, handleErrorAsync(spaceController.addUserToSpace));
router.delete("/delete-space-member", checkJWT, handleErrorAsync(spaceController.deleteUserFromSpace));
router.post("/create-space-and-member", checkJWT, handleErrorAsync(spaceController.createSpaceAndAddUser));
router.post("/find-spaces-by-userid", checkJWT, handleErrorAsync(spaceController.getSpacesByUserId));

// Chat Subsystem OPs
router.post("/find-chat", checkJWT, handleErrorAsync(chatController.getChatById));
router.post("/find-chat-members", checkJWT, handleErrorAsync(chatController.getChatMembers));
router.post("/create-chat", checkJWT, handleErrorAsync(chatController.addChat));
router.post("/create-chat-and-member", checkJWT, handleErrorAsync(chatController.createChatAndAddUser));
router.put("/create-chat-member", checkJWT, handleErrorAsync(chatController.addChatMember));
router.post("/find-chats-by-space-and-userid", checkJWT, handleErrorAsync(chatController.getChatsByUserId));
router.put("/update-chat", checkJWT, handleErrorAsync(chatController.updateChat));
router.delete("/delete-chat-member", checkJWT, handleErrorAsync(chatController.deleteChatMember));

// Message Subsystem Ops
router.post("/send-message", checkJWT, handleErrorAsync(messageController.addMessage));
router.post("/get-message-chunk", checkJWT, handleErrorAsync(messageController.getMessagesChunk));


// Task OPs
router.post("/add-task", checkJWT ,taskController.addTask);
router.post("/find-task", checkJWT ,taskController.getTaskById);


router.use("/auth", authRouter)

module.exports = router
