const HttpStatus = require('http-status-codes');

const taskService = require("../services/taskService");

const getTaskById = async (req, res) => {
    const taskId = req.body.taskId;
    const task = await taskService.getTaskById(taskId);
    if (task.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(task);
    }
    return res.status(HttpStatus.OK).json(task);
};

const addTask = async (req, res) => {
    console.log(req.body);
    const task = await taskService.addTask(req.body);
    if (task.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(task);
    }
    return res.status(HttpStatus.OK).json(task);
};


module.exports = {addTask, getTaskById};
