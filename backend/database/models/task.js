const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    start_date: {
        type: String, // Date
        required: true
    },
    end_date: {
        type: String, // Date
        required: true
    },
    complexity: {
        type: String, // Date
        required: true
    },
    repetition: {
        type: String, // Date
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
        type: String,// Boolean
        required: true
    },
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
