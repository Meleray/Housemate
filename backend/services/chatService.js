const chatModel = require("../database/models/chat");
const spaceModel = require("../database/models/space");
const utilsForServices = require("./utilsForServices");
const {assertKeysValid, pick} = require("./utilsForServices");
const HttpStatus = require("http-status-codes");


const returnableChatFields = ['_id', 'chatName', 'spaceId', 'chatMembers'];

class ChatService {

    getChatById = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId'], [])

        const chat = await chatModel.findById(requestBody.chatId).select(returnableChatFields);
        if (!chat) {
            return {error: {type: "CHAT_NOT_FOUND", message: `There is no chat for id=${requestBody.chatId}`}};
        }
        return chat;
    };

    getChatMembers = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId'], [])
        return chatModel.findById(requestBody.chatId).populate(
            {path: 'chatMembers', select: ['userName', 'userPicture', 'userEmail']})
            .select(['chatMembers', '-_id'])
    };

    addChat = async (requestBody) => {
        assertKeysValid(requestBody, ['chatName', 'spaceId'], ['chatMembers'])
        if (!(await spaceModel.exists({_id: requestBody.spaceId}))){
            return {error: {type: "FAILED_TO_ADD_CHAT", message: `There is no space with id=${requestBody.spaceId}`}};
        }
        const chat = await chatModel.create(requestBody);
        return pick(chat, returnableChatFields);
    };

    addChatMember = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId', 'userId'])
        const {chatId, userId} = requestBody
        const chatExtracted = await chatModel.findById(chatId).populate({path: 'spaceId'})

        if (chatExtracted == null) {
            return {error: {type: "FAILED_TO_ADD_CHAT_MEMBER", message: `There is no chat with id=${chatId}`}};
        }
        let spaceMembers = chatExtracted.spaceId.spaceMembers.map(item => item.memberId.toString());
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
        ).select(returnableChatFields)
    };

    createChatAndAddUser = async (requestBody) => {
        // todo assert
        const {userId, ...chatData} = requestBody

        const chat = await this.addChat(chatData)
        return  this.addChatMember(chat._id, userId);
    }

    deleteChatMember = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId', 'userId'])
        const {chatId, userId} = requestBody

        const chat = await chatModel.findByIdAndUpdate(chatId, {
            $pull: {chatMembers: userId}  // update 'chatMembers' only if userId is not presented in it
        }, {new: true}).select(returnableChatFields)
        if (!chat) {
            return {
                error: {type: "CHAT_NOT_FOUND", message: `There is no chat for id=${chatId}`}
            }
        }
        return chat;
    };

    updateChat = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId'], ['chatName'])
        const {chatId, ...updData} = requestBody;
        return chatModel.findByIdAndUpdate(chatId, updData, {new: true}).select(returnableChatFields);
    }

    getChatsBySpaceAndUserId = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId', 'userId'], [])
        const {spaceId, userId} = requestBody;

        return chatModel.find({
            $and: [
                {spaceId: spaceId},
                {chatMembers: {"$in": [userId]}}
            ]
        }).select(returnableChatFields)
    }
}

module.exports = new ChatService();
