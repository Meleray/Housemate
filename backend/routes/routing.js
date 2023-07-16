const express = require('express');
const router = express.Router();
const {checkJWT} = require("../middleware/checkAuth");
const {encryptPassword} = require("../middleware/encryptPassword");

const userService = require("../controllers/userController");
const spaceService = require("../controllers/spaceController");
const chatService = require("../controllers/chatController");
const messageService = require("../controllers/messageController");
const taskService = require("../controllers/taskController");

const authRouter = require("./subsystems/authRouter");

const HttpStatus = require("http-status-codes");

const handleController = func => async (req, res, next) => {
    /*
    An additional wrapping function like this is the only way to catch an async exceptions in Express.js
    and pass them further for responding to client with an error.
    You can catch exceptions with `process.on('uncaughtException', function(err) {...});`,
    but in this case you are not able to send a response.
    https://stackoverflow.com/questions/43356705/node-js-express-error-handling-middleware-with-router
    */

    let controllerResult;
    try {
        controllerResult = await func(req.body);
    } catch (error) {
        next(error);
    }

    if (controllerResult == null || controllerResult.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(controllerResult);
    }
    return res.status(HttpStatus.OK).json(controllerResult);
};

// Database OPs
router.post("/find-user", checkJWT, handleController(userService.getUserById));
router.post("/create-user", encryptPassword, handleController(userService.addUser));
router.put("/update-user", checkJWT, encryptPassword, handleController(userService.updateUser));
router.delete("/delete-user", checkJWT, handleController(userService.deleteUser));

// Space OPs
router.post("/find-space", checkJWT, handleController(spaceService.getSpaceById));
router.post("/create-space", checkJWT, handleController(spaceService.addSpace));
router.post("/find-space-members", checkJWT, handleController(spaceService.getSpaceMembers));
router.post("/find-spaces-by-userid", checkJWT, handleController(spaceService.getSpacesByUserId));
router.put("/create-space-member", checkJWT, handleController(spaceService.addSpaceMember));
router.post("/join-space", checkJWT, handleController(spaceService.joinSpace));
router.delete("/delete-space-member", checkJWT, handleController(spaceService.deleteSpaceMember));
router.put("/promote-to-admin", checkJWT, handleController(spaceService.promoteToAdmin));
router.post("/get-invite-code", checkJWT, handleController(spaceService.getInviteCode));
router.put("/change-invite-code", checkJWT, handleController(spaceService.changeInviteCode));

// Chat Subsystem OPs
router.post("/find-chat", checkJWT, handleController(chatService.getChatById));
router.post("/find-chat-members", checkJWT, handleController(chatService.getChatMembers));
router.post("/find-chat-members-and-notmembers", checkJWT, handleController(chatService.getMembersAndNotMembers));
router.post("/create-chat", checkJWT, handleController(chatService.addChat));
router.put("/add-chat-member", checkJWT, handleController(chatService.addChatMember));
router.post("/find-chats-by-space-and-userid", checkJWT, handleController(chatService.getChatsBySpaceAndUserId));
router.put("/update-chat", checkJWT, handleController(chatService.updateChat));
router.delete("/delete-chat-member", checkJWT, handleController(chatService.deleteChatMember));

// Message Subsystem Ops
router.post("/send-message", checkJWT, handleController(messageService.addMessage));
router.post("/load-message-chunk", checkJWT, handleController(messageService.getMessagesChunk));


// Task OPs
router.post("/add-task", checkJWT ,handleController(taskService.addTask));
router.post("/find-task", checkJWT ,handleController(taskService.getTaskById));
router.post("/find-tasks-by-spaceid", checkJWT, handleController(taskService.getTasksBySpaceId));
router.delete("/delete-task", checkJWT, handleController(taskService.deleteTask));
router.put("/edit-task", checkJWT, handleController(taskService.editTask));
router.put("/update-task-completion", checkJWT, handleController(taskService.updateTaskCompletion));

router.use("/auth", authRouter)

module.exports = router
