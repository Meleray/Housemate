const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/test", (req, res) => {
    // Write the database access here
})
router.get("/profile", userController.getProfile);

module.exports = router