const HttpStatus = require('http-status-codes');

const messageService = require("../services/messageService");

const addMessage = async (req, res) => {
    const message = await messageService.addMessage(req.body);
    if (message == null || message.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(message);
    }
    return res.status(HttpStatus.OK).json(message);
};

const getMessagesChunk = async (req, res) => {
    const messages = await messageService
        .getMessagesChunk(req.body.chatId, req.body.getOlderThan);
    if (messages == null || messages.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(messages);
    }
    return res.status(HttpStatus.OK).json(messages);
}

module.exports = {addMessage, getMessagesChunk};