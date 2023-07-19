const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const utilsForTests = require("./utilsForTests");
const server = 'localhost:5001';

chai.use(chaiHttp);


describe('Message system', () => {
    let spaceId;
    let userMember1 = {
        userName: "Member First",
        userPassword: "qwerty",
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let userMember2 = {
        userName: "Member Second",
        userPassword: "qwerty",
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let chat = {
        // _id: will be filled out further
        chatName: "Secret conspiracy of long humans", // will be changed
        // space: will be filled out further
        // chatMembers: will be filled out further
    }

    let messages = ["Hi, dude",
        "How have you become so long?",
        "What is the weather like up there?",
        "Hi, shorty. Long people does not share their secrets with short ones."]

    before('prepare data', async () => {
        // add a space to the DB
        const resAddSpace = await chai.request(server)
            .post('/api/create-space')
            .send({spaceName: "Another house with high ceilings"})
        chai.expect(resAddSpace, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        spaceId = resAddSpace.body._id;
        chat.spaceId = spaceId;

        // add a chat
        const resAddChat = await chai.request(server).post('/api/create-chat').send(chat)
        chai.expect(resAddChat, JSON.stringify(resAddChat.body)).to.have.status(HttpStatus.OK);
        chat = resAddChat.body;

        // add the users to the DB and make them members of the space and of the chat
        for (const user of [userMember1, userMember2]) {
            const resAddUser = await chai.request(server).post('/api/create-user').send(user)
            chai.expect(resAddUser, JSON.stringify(resAddUser.body)).to.have.status(HttpStatus.OK);
            user._id = resAddUser.body._id;

            const resAddSpaceMember = await chai.request(server)
                .put('/api/create-space-member')
                .send({userId: user._id, spaceId: chat.spaceId})
            chai.expect(resAddSpaceMember, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);

            const resAddChatMember = await chai.request(server)
                .put('/api/add-chat-member')
                .send({newMemberId: user._id, chatId: chat._id})
            chai.expect(resAddChatMember, JSON.stringify(resAddChatMember.body)).to.have.status(HttpStatus.OK);
        }
    });

    it('send incorrect messages', async () => {
        const resSendMessage1 = await chai.request(server).post('/api/send-message').send(
            {messageText: "", chatId: utilsForTests.nonExistId, senderId: userMember1._id})
        chai.expect(resSendMessage1, JSON.stringify(resSendMessage1.body)).to.have.status(HttpStatus.BAD_REQUEST);

        const resSendMessage2 = await chai.request(server).post('/api/send-message').send(
            {messageText: "", chatId: chat._id, senderId: utilsForTests.nonExistId})
        chai.expect(resSendMessage2, JSON.stringify(resSendMessage2.body)).to.have.status(HttpStatus.BAD_REQUEST);
    });

    it('send messages', async () => {
        for (const message of messages.slice(0, -1)) {
            const messageData = {
                messageText: message,
                chatId: chat._id,
                senderId: userMember1._id,
            }
            const resSendMessage = await chai.request(server).post('/api/send-message').send(messageData)
            chai.expect(resSendMessage, JSON.stringify(resSendMessage.body)).to.have.status(HttpStatus.OK);
            utilsForTests.compareObjects(resSendMessage.body, messageData, ["_id", "date", "isNotification"])
        }

        const answerData = {
            messageText: messages.at(-1),
            chatId: chat._id,
            senderId: userMember2._id,
        }
        const resSendAnswer = await chai.request(server).post('/api/send-message').send(answerData)
        chai.expect(resSendAnswer, JSON.stringify(resSendAnswer.body)).to.have.status(HttpStatus.OK);
        utilsForTests.compareObjects(resSendAnswer.body, answerData, ["_id", "date", "isNotification"])
    });

    it('read messages', async () => {
        const plainReadRes = await chai.request(server)
            .post('/api/load-message-chunk').send({chatId: chat._id})
        let messagesBodies = plainReadRes.body.map(b => b.messageText);
        chai.expect(messagesBodies, JSON.stringify(messagesBodies)).to.be.eql(messages);

        const thirdMessageTime = plainReadRes.body.at(2).date; // yes third => at 2
        const olderReadRes = await chai.request(server)
            .post('/api/load-message-chunk').send({chatId: chat._id, getOlderThan: thirdMessageTime})
        let oldMessagesBodies = olderReadRes.body.map(b => b.messageText);
        chai.expect(oldMessagesBodies, JSON.stringify(oldMessagesBodies)).to.be.eql(messages.slice(0, 2));
    });
})
