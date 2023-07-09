const HttpStatus = require('http-status-codes');

const chatService = require("../services/chatService");

const getChatById = async (req, res) => {
    const chat = await chatService.getChatById(req.body);
    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat);
};

const getChatMembers  = async (req, res) => {
    const chatMembers = await chatService.getChatMembers(req.body);
    if (chatMembers == null || chatMembers.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chatMembers);
    }
    return res.status(HttpStatus.OK).json(chatMembers);
};

const addChat = async (req, res) => {
    const chat = await chatService.addChat(req.body)
    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat);
};

const addChatMember = async (req, res) => {
    const chat = await chatService.addChatMember(req.body);

    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat)
};

const createChatAndAddUser = async (req, res) => {
    let chatData = structuredClone(req.body)
    delete chatData.userId
    const chat = await chatService.addChat(chatData)

    const userId = req.body.userId;
    const chatUpdated = await chatService.addChatMember(chat._id, userId);

    if (chatUpdated == null || chatUpdated.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chatUpdated);
    }
    return res.status(HttpStatus.OK).json(chatUpdated)
}

const updateChat = async (req, res) => {
    const updatedChat = await chatService.updateChat(req.body)
    if (updatedChat == null || updatedChat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(updatedChat);
    }
    return res.status(HttpStatus.OK).json(updatedChat);
}

const deleteChatMember = async (req, res) => {
    const chat = await chatService.deleteChatMember(req.body);

    if (chat == null || chat.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chat);
    }
    return res.status(HttpStatus.OK).json(chat)
}

const getChatsBySpaceAndUserId = async (req, res) => {
    const chats = await chatService.getChatsBySpaceAndUserId(req.body);

    if (chats == null || chats.error) {
        return res.status(HttpStatus.BAD_REQUEST).json(chats);
    }
    return res.status(HttpStatus.OK).json(chats)
}

module.exports = {
    getChatById,
    getChatMembers,
    addChat,
    addChatMember,
    createChatAndAddUser,
    deleteChatMember,
    updateChat,
    getChatsBySpaceAndUserId
};
