const taskModel = require("../database/models/task");
const spaceModel = require("../database/models/space");
const utilsForServices = require("./utilsForServices");


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

    deleteTask = async (taskId) => {
        const task = await taskModel.findByIdAndDelete(taskId);
      
        if (!task) {
          return {
            error: { type: "TASK_NOT_FOUND", message: `There is no task for id=${"taskId"}` }
          };
        }
      
        return { success: true };
      };

    getTasksBySpaceAndUserId = async (spaceId) => {
        return taskModel.find({
            $and: [
                {spaceId: spaceId}
            ]
        })
    }

}

module.exports = new TaskService();
