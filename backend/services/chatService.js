const chatModel = require("../database/models/chat");
const userModel = require("../database/models/user");

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

    addChatMember = async (chatId, userId) => {
        if (!(await userModel.exists({_id: userId}))) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
        }
        const chat = await chatModel.findByIdAndUpdate({_id: chatId}, {
            $addToSet: {chatMembers: userId}  // update 'chatMembers' only if userId is not presented in it
        })
        // const space = await spaceModel.findByIdAndUpdate({_id: spaceId}, {
        //     $addToSet: {spaceMembers: userId}  // update 'spaceMembers' only if userId is not presented in it
        // })
        if (!chat) {
            return {
                error: {type: "CHAT_NOT_FOUND", message: `There is no chat for id=${chatId}`}
            }
        }
        await chat.save();
        return chat;
    };
}

module.exports = new ChatService();
