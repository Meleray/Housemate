const taskModel = require("../database/models/task");
const spaceModel = require("../database/models/space");

class TaskService {
    getTaskById = async (taskId) => {
        const task = await taskModel.findById(taskId);
        if (!task) {
            return {error: {type: "TASK_NOT_FOUND", message: `There is no task for id=${taskId}`}};
        }
        return task;
    };

    addTask = async (taskData) => {
        try {
            return await taskModel.create(taskData);
        } catch (err) {
            return {error: {type: "FAILED_TO_ADD_TASK", message: err.message}};
        }
    };

}

module.exports = new TaskService();
