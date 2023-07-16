const mongoose = require("mongoose");
const utilsForModels = require("./utilsForModels");
const Schema = mongoose.Schema;  // for foreign keys

const TaskSchema = new mongoose.Schema({
    assigned_user: {
        type: Schema.Types.ObjectId,
        ref: 'AssignedUser',
        required: true,
    },
    start_date: {
        type: Date, // Date
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
    completion: {
        type: Boolean,// Boolean
        default: false,
        required: true
    },
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
