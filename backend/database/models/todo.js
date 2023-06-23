const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema({
    taskDescription: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 150,
    }
    /*
    responsibleUser: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 150,
        // validation ==> does the user exist?
    },
    start_date: {
        type: String, // should be a datetime type
        required: true
        // valiation if the datetime is correct
    },
    end_date: {
        type: String, // should be a datetime type
        required: true
        // valiation if the datetime is correct
    },
    complexity: {
        type: String, // should be a datetime type
        required: true
    },
    repetition: {
        type: String, // should be a datetime type
        required: true
    },
    body: {
        type: String,
        required: true
    },
    notification_type: {
        type: String,
        required: true
    },
    notification_time: {
        type: String,
        required: true
    },
    admin_approval: {
        type: String,
        required: true
    },
    */
});

const ToDo = mongoose.model("ToDo", ToDoSchema);
module.exports = ToDo;
