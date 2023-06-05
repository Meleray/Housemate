const chatModel = require("../database/models/chat");

class ChatService{

    getChatById = async (chatId) => {
        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return {error: {type: "CHAT_NOT_FOUND", message: `There is no chat for id=${chatId}`}};
        }
        return chat;
    };

    addChat = async (chat) => {
        try {
            return await chatModel.create(chat);
        } catch(err) {
            return {error: {type: "FAILED_TO_ADD_CHAT", message: err.message}};
        }
    };


}

module.exports = new ChatService();
