const chatModel = require("../database/models/chat");
const userModel = require("../database/models/user");
const spaceModel = require("../database/models/space");

class ChatService {

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
        } catch (err) {
            return {error: {type: "FAILED_TO_ADD_CHAT", message: err.message}};
        }
    };

    addChatMember = async (chatId, userId) => {
        const chatExtracted = await chatModel.findById(chatId)
            .populate({path: 'space'})

        if (chatExtracted == null){
            return {error: {type: "FAILED_TO_ADD_CHAT_MEMBER", message: `There is no chat with id=${chatId}`}};
        }
        let spaceMembers = chatExtracted.space.spaceMembers
        if (! spaceMembers.includes(userId)) {
            return {
                error: {
                    type: "FAILED_TO_ADD_CHAT_MEMBER",
                    message: `The user id=${userId} is not a member of the chat's space ${chatExtracted.space._id.toString()}`
                }
            };
        }

        const chat = await chatModel.findByIdAndUpdate({_id: chatId}, {
            $addToSet: {chatMembers: userId}  // update 'chatMembers' only if userId is not presented in it
        })
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
