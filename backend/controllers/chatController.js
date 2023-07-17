const chatModel = require("../database/models/chat");
const spaceModel = require("../database/models/space");
const {assertKeysValid, pick} = require("./utilsForControllers");
const {assertUserBelongs2Space} = require("./assert");
const spaceController = require("./spaceController");


const returnableChatFields = ['_id', 'chatName', 'spaceId', 'chatMembers'];

class ChatController {

    getChatById = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId'], ['userId'])

        const chat = await chatModel.findById(requestBody.chatId).select(returnableChatFields);
        if (!chat) {
            return {error: `There is no chat for id=${requestBody.chatId}`}
        }
        return chat;
    };

    getChatMembers = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId'], ['userId'])
        return chatModel.findById(requestBody.chatId).populate(
            {path: 'chatMembers', select: ['userName', 'userPicture', 'userEmail']})
            .select(['chatMembers', '-_id'])
    };

    getMembersAndNotMembers = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId'], ['userId'])

        // I was trying to execute this request inside the database.
        // I spent several hours trying to implement this with 'chatModel.aggregate([..])'. But I was desperate
        const chat = await chatModel.findById(requestBody.chatId)
        let spaceMembers = await spaceController.getSpaceMembers({spaceId: chat.spaceId})
        for(const  member of spaceMembers){
            member.isChatMember = chat.chatMembers.includes(member._id);
        }
        return spaceMembers
    }

    addChat = async (requestBody) => {
        assertKeysValid(requestBody, ['chatName', 'spaceId'], ['chatMembers', 'userId'])

        if (requestBody.hasOwnProperty('chatMembers')) {
            for (const userId of requestBody.chatMembers) {
                await assertUserBelongs2Space({userId: userId, spaceId: requestBody.spaceId})
            }
        }
        if (!(await spaceModel.exists({_id: requestBody.spaceId}))) {
            return {error: `There is no space with id=${requestBody.spaceId}`};
        }
        const chat = await chatModel.create(requestBody);
        return pick(chat, returnableChatFields);
    };

    addChatMember = async (requestBody) => {
        assertKeysValid(requestBody, ['chatId', 'newMemberId'], ['userId'])

        const {chatId, newMemberId} = requestBody
        const spaceId = await chatModel.findById(chatId).select('spaceId')
        if (spaceId == null) {
            return {error: `There is no chat with id=${chatId}`};
        }
        await assertUserBelongs2Space({userId: newMemberId, spaceId: spaceId})

        return chatModel.findByIdAndUpdate(chatId,
            {$addToSet: {chatMembers: newMemberId}}, // update 'spaceMembers' only if userId is not presented in it
            {new: true}
        ).select(returnableChatFields)
    };

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
        assertKeysValid(requestBody, ['chatId'], ['chatName', 'userId'])
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

module.exports = new ChatController();
