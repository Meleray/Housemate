const taskModel = require("../database/models/task");
const {assertKeysValid, pick} = require("./utilsForControllers");
const spaceController = require("./spaceController");

const returnableTaskFields = ['_id', 'assigned_user', 'spaceId', 'taskName', 'start_date', 'end_date', 'complexity', 'repetition', 'body', 'notification_type', 'notification_time', 'admin_approval', 'completion'];

class TaskController {
    getTaskById = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', '._id'], [])
        const task = await taskModel.findById(requestBody.taskId)
            .select(returnableTaskFields);
        if (!task) {
            return {error: `There is no task for id=${requestBody.taskId}`};
        }
        return task;
    };


    addTask = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'assigned_user', 'spaceId', 'start_date', 
            'end_date', 'complexity', 'repetition', 'body', 'notification_type', 
            'notification_time', 'admin_approval', 'completion'])
        const task = await taskModel.create(requestBody);
        return pick(task, returnableTaskFields)
    };

    editTask = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'assigned_user', 'start_date', 
            'end_date', 'complexity', 'repetition', 'body', 'notification_type', 
            'notification_time', 'admin_approval', 'spaceId', 'taskId', 'completion'])
        let updValues = structuredClone(requestBody)
        delete updValues._id
        return taskModel.findByIdAndUpdate(requestBody.taskId, {$set: updValues}, {new: true})
    }

    updateTaskCompletion = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'taskId', 'completion'])
        let updValues = structuredClone(requestBody)
        delete updValues._id
        return taskModel.findByIdAndUpdate(requestBody.taskId, {$set: updValues}, {new: true})
    }

    deleteTask = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'taskId'], [])
        const taskId = requestBody.taskId
        const task = await taskModel.findByIdAndDelete(taskId);
      
        if (!task) {
          return {
            error: { type: "TASK_NOT_FOUND", message: `There is no task for id=${"taskId"}` }
          };
        }
      
        return { success: true };
      };

    getTasksBySpaceId = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'spaceId'], [])
        const {spaceId} = requestBody;

        return taskModel.find({
            $and: [
                {spaceId: spaceId},
            ]
        }).select(returnableTaskFields)
    }
}

module.exports = new TaskController();
