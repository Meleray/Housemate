const todoModel = require("../database/models/todo");

class ToDoService {

    // add task
    addToDo = async (todoData) => {
        try {
            return await todoModel.create(todoData);
        } catch (err) {
            return {error: {type: "FAILED_TO_ADD_TASK", message: err.message}};
        }
    };

}

module.exports = new ToDoService();
