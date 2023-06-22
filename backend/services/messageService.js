const utilsForServices = require("./utilsForServices");

const messageModel = require("../database/models/message");
const chatModel = require("../database/models/chat");


class MessageService {

    addMessage = async (messageData) => {
        let keysCheck = utilsForServices.areKeysValid(messageData,
            ["messageText", "chatId", "senderId", "isNotification"])
        if (keysCheck.errorMessage != null) {
            return {error: {type: "FAILED_TO_ADD_MESSAGE", message: keysCheck.errorMessage}};
        }

        let chat = await chatModel.findById(messageData.chatId)
        if (chat == null) {
            return {
                error: {type: "FAILED_TO_ADD_MESSAGE", message: `A chat with id=${messageData.chatId} does not exist`}
            };
        }
        if (!chat.chatMembers.includes(messageData.senderId)) {
            return {
                error: {
                    type: "FAILED_TO_ADD_MESSAGE",
                    message: `The user ${messageData.senderId} is not a member of the chat ${messageData.chatId}`
                }
            };
        }

        return messageModel.create(messageData);
    };

    getMessagesChunk = async (chatId, getOlderThan) => {
        const chunkSize = 50;

        if (getOlderThan == null) {
            return messageModel.find({chatId: chatId}).sort({date: 'descending'}).limit(chunkSize).exec();
        } else {
            return messageModel.find({chatId: chatId, date: {$gt: getOlderThan}})
                .sort({date: 'descending'}).limit(chunkSize).exec();
        }
    }

}

module.exports = new MessageService();