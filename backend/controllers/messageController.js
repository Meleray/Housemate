const utilsForServices = require("./utilsForControllers");

const messageModel = require("../database/models/message");
const chatModel = require("../database/models/chat");
const chatController = require("./chatController");
const {assertKeysValid} = require("./utilsForControllers");
const {assertUserExist} = require("./assert");


class MessageController {

    addMessage = async (requestBody) => {
        assertKeysValid(requestBody, ['messageText', 'chatId', 'senderId'], [])

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

    addNotificationMessage = async (requestBody) => {
        // TODO: I did not test this method. But I believe it works
        assertKeysValid(requestBody, ['spaceId', 'recipientId', 'messageText'], [])

        const notificationChatName = "Personal notifications"
        const userId = requestBody.recipientId
        await assertUserExist({userId: userId})
        requestBody.isNotification = true

        let chatId = (await
                chatModel.find({chatName: notificationChatName, chatMembers: [userId]}).select('_id')
        )._id
        if (chatId === null) {
            const chat = await chatController.addChat(
                {spaceId: requestBody.spaceId, chatName: notificationChatName, chatMembers: [userId]})
            chatId = chat._id
        }
        return messageModel.create({messageText: requestBody.messageText, chatId: chatId, isNotification: true});
    }

    getMessagesChunk = async (requestBody) => {
        const chunkSize = 3;  // TODO make the chunk bigger

        assertKeysValid(requestBody, ['chatId'], ['getOlderThan', 'getNewerThan'])
        let result;
        if (requestBody.hasOwnProperty("getOlderThan")) {
            result = await messageModel.find({chatId: requestBody.chatId, date: {$lt: requestBody.getOlderThan}})
                .sort({date: 'descending'}).limit(chunkSize)

        } else if (requestBody.hasOwnProperty("getNewerThan")) {
            result = await messageModel.find({chatId: requestBody.chatId, date: {$gt: requestBody.getNewerThan}})
                .sort({date: 'descending'})

        } else {
            result = await messageModel.find({chatId: requestBody.chatId})
                .sort({date: 'descending'}).limit(chunkSize)
        }
        // because there is no easy vay to get LAST n items in mongodb))))
        return result.reverse()
    }

}

module.exports = new MessageController();