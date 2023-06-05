const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const spaceController = require("../controllers/spaceController");
const chatController = require("../controllers/chatController");


router.get("/find-user", userController.getUserById);
router.post("/add-user", userController.addUser);
router.put("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);
router.put("/add-space-member", userController.addUserToSpace);
router.delete("/delete-space-member", userController.deleteUserFromSpace);
router.get("/find-spaces-by-userid", userController.getSpacesByUserId);


router.get("/find-space", spaceController.getSpaceById);
router.post("/add-space", spaceController.addSpace);

router.get("/find-chat", chatController.getChatById);
router.post("/add-chat", chatController.addChat);

module.exports = router
