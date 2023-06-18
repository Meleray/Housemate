const chatModel = require("../database/models/chat");
const userModel = require("../database/models/user");
const spaceModel = require("../database/models/space");
const utilsForServices = require("./utilsForServices");

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
        const chatExtracted = await chatModel.findById(chatId).populate({path: 'spaceId'})

        if (chatExtracted == null) {
            return {error: {type: "FAILED_TO_ADD_CHAT_MEMBER", message: `There is no chat with id=${chatId}`}};
        }
        let spaceMembers = chatExtracted.spaceId.spaceMembers;
        if (!spaceMembers.includes(userId)) {
            return {
                error: {
                    type: "FAILED_TO_ADD_CHAT_MEMBER",
                    message: `The user id=${userId} is not a member of the chat's space ${chatExtracted.spaceId._id.toString()}`
                }
            };
        }
        return chatModel.findByIdAndUpdate(chatId,
            {$addToSet: {chatMembers: userId}}, // update 'spaceMembers' only if userId is not presented in it
            {new: true}
        )
    };

    deleteChatMember = async (chatId, userId) => {
        const chat = await chatModel.findByIdAndUpdate(chatId, {
            $pull: {chatMembers: userId}  // update 'chatMembers' only if userId is not presented in it
        }, {new: true})
        if (!chat) {
            return {
                error: {type: "CHAT_NOT_FOUND", message: `There is no chat for id=${chatId}`}
            }
        }
        return chat.save();
    };

    updateChat = async (chatData) => {
        let updValues = structuredClone(chatData)
        delete updValues._id
        let keysCheck = utilsForServices.areKeysValid(updValues,["chatName"])
        if (keysCheck.errorMessage != null) {
            return {error: {type: "FAILED_TO_UPDATE_CHAT", message: keysCheck.errorMessage}};
        }
        return chatModel.findByIdAndUpdate(chatData._id, updValues, {new: true})
    }

    getChatsByUserId = async (userId) => {
        try {
            return await chatModel.find({chatMembers: { "$in" : [userId]} })
        } catch (err) {
            return {error: {type: "FAILED_TO_FIND_CHAT", message: err.message}};
        }
    }
}

module.exports = new ChatService();
