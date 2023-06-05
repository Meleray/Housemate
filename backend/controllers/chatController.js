const HttpStatus = require('http-status-codes');

const chatService = require("../services/chatService");

const getChatById = async (req, res) => {
    const chatId = req.body.chatId;
    const chat = await chatService.getChatById(chatId);
    if (chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json({error: chat.error});
    }
    return res.status(HttpStatus.OK).json(chat);
};

const addChat = async (req, res) => {
    const chat = await chatService.addChat(req.body)
    if (chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json({error: chat.error});
    }
    return res.status(HttpStatus.OK).json({message: "A chat added successfully", response: chat});
};


module.exports = {getChatById, addChat};