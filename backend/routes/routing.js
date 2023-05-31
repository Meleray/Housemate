const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/find-user", userController.getUserById);
router.post("/add-user", userController.addUser);

module.exports = router