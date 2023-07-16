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

    async isChatPremium(chatId) {
        const space = await chatModel.findById(chatId).select('spaceId')
            .populate({path: 'spaceId', select: 'premiumExpiration'})
        return space.spaceId.premiumExpiration > Date.now();
    }

    getMessagesChunk = async (requestBody) => {
        const chunkSize = 4;  // TODO make the chunk bigger
        const freeTierTimeDelta = new Date().setMonth(new Date().getMonth() - 3)  // 3 months ago

        assertKeysValid(requestBody, ['chatId'], ['getOlderThan', 'getNewerThan'])

        let filter = {chatId: requestBody.chatId}
        if (requestBody.hasOwnProperty("getOlderThan")) {
            filter.date = {$lt: requestBody.getOlderThan}
        } else if (requestBody.hasOwnProperty("getNewerThan")) {
            filter.date = {$gt: requestBody.getNewerThan}
        }
        let result = await messageModel.find(filter).populate({path: 'senderId', select: ['userName']})
            .sort({date: 'descending'}).limit(chunkSize)

        const isPremium = await this.isChatPremium(requestBody.chatId)
        if ((!isPremium) && (result.length > 0) && (result.at(-1).date < freeTierTimeDelta)) {
            result = result.filter(message => message.date > freeTierTimeDelta)
            result.push({
                _id: null,
                messageText: "Get premium in order to load all the messages",
                chatId: requestBody.chatId,
                date: freeTierTimeDelta,
                isNotification: false
            })
        }
        // because there is no easy vay to get LAST n items in mongodb))))
        return result.reverse()
    }

}

module.exports = new MessageController();