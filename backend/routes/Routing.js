const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/test", (req, res) => {
    // Write the database access here
})

router.get("/profile", userController.getProfile);
router.post("/add-profile", userController.addProfile); //use this route to add a course to the database

module.exports = router