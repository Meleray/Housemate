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

const deleteTask = async (req, res) => {
    const taskId = req.body.taskId;
    const task = await taskService.deleteTask(taskId);

    if (task == null || task.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(task);
    }
    return res.status(HttpStatus.OK).json(task)
};

const getTasksBySpaceAndUserId = async (req, res) => {
    const spaceId = req.body.spaceId;
    const tasks = await taskService.getTasksBySpaceAndUserId(spaceId);

    if (tasks == null || tasks.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(tasks);
    }
    return res.status(HttpStatus.OK).json(tasks)
}


module.exports = {
    addTask, 
    getTaskById,
    deleteTask,
    getTasksByUserId: getTasksBySpaceAndUserId
};
