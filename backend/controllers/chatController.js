const HttpStatus = require('http-status-codes');

const chatService = require("../services/chatService");

const getChatById = async (req, res) => {
    const chatId = req.body.chatId;
    const chat = await chatService.getChatById(chatId);
    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat);
};

const addChat = async (req, res) => {
    const chat = await chatService.addChat(req.body)
    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat);
};

const addChatMember = async (req, res) => {
    const userId = req.body.userId;
    const chatId = req.body.chatId;
    const chat = await chatService.addChatMember(chatId, userId);

    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat)
};

const updateChat = async (req, res) => {
    const updatedChat = await chatService.updateChat(req.body)
    if (updatedChat == null || updatedChat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(updatedChat);
    }
    return res.status(HttpStatus.OK).json(updatedChat);
}

const deleteChatMember = async (req, res) => {
    const userId = req.body.userId;
    const chatId = req.body.chatId;
    const chat = await chatService.deleteChatMember(chatId, userId);

    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat)
}

module.exports = {getChatById, addChat, addChatMember, deleteChatMember, updateChat};
