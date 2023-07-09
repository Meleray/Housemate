const taskModel = require("../database/models/task");
const spaceModel = require("../database/models/space");

class TaskService {
    getTaskById = async (requestBody) => {
        const task = await taskModel.findById(requestBody.taskId);
        if (!task) {
            return {error: {type: "TASK_NOT_FOUND", message: `There is no task for id=${requestBody.taskId}`}};
        }
        return task;
    };

    addTask = async (requestBody) => {
        try {
            return await taskModel.create(requestBody);
        } catch (err) {
            return {error: {type: "FAILED_TO_ADD_TASK", message: err.message}};
        }
    };

}

module.exports = new TaskService();
