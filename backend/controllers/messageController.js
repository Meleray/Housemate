const utilsForServices = require("./utilsForControllers");

const messageModel = require("../database/models/message");
const chatModel = require("../database/models/chat");
const {assertKeysValid} = require("./utilsForControllers");


class MessageController {

    addMessage = async (requestBody) => {
        assertKeysValid(requestBody, ['messageText', 'chatId', 'senderId'], ['isNotification'])

        let chat = await chatModel.findById(requestBody.chatId)
        if (chat == null) {
            return {
                error: {type: "FAILED_TO_ADD_MESSAGE", message: `A chat with id=${requestBody.chatId} does not exist`}
            };
        }
        if (!chat.chatMembers.includes(requestBody.senderId)) {
            return {
                error: {
                    type: "FAILED_TO_ADD_MESSAGE",
                    message: `The user ${requestBody.senderId} is not a member of the chat ${requestBody.chatId}`
                }
            };
        }

        return messageModel.create(requestBody);
    };

    getMessagesChunk = async (requestBody) => {
        const chunkSize = 50;

        assertKeysValid(requestBody, ['chatId'], ['getOlderThan'])
        const {chatId, getOlderThan} = requestBody
        if (getOlderThan == null) {
            return messageModel.find({chatId: chatId}).sort({date: 'descending'}).limit(chunkSize).exec();
        } else {
            return messageModel.find({chatId: chatId, date: {$gt: getOlderThan}})
                .sort({date: 'descending'}).limit(chunkSize).exec();
        }
    }

}

module.exports = new MessageController();