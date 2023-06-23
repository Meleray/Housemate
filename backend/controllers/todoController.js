const HttpStatus = require('http-status-codes');

const todoService = require("../services/todoService");

const addToDo = async (req, res) => {
    console.log(req.body);
    const todo = await todoService.addToDo(req.body);
    if (todo.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(todo);
    }
    return res.status(HttpStatus.OK).json(todo);
};

module.exports = {addToDo};
