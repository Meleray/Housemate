const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const utilsForTests = require("./utilsForTests");
const server = 'localhost:5000';

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
            .post('/api/add-space')
            .send({spaceName: "Another house with high ceilings"})
        utilsForTests.logRequest(resAddSpace.request);
        chai.expect(resAddSpace, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        spaceId = resAddSpace.body._id;
        chat.spaceId = spaceId;

        // add a chat
        const resAddChat = await chai.request(server).post('/api/add-chat').send(chat)
        utilsForTests.logRequest(resAddChat.request);
        chai.expect(resAddChat, JSON.stringify(resAddChat.body)).to.have.status(HttpStatus.OK);
        chat = resAddChat.body;

        // add the users to the DB and make them members of the space and of the chat
        for (const user of [userMember1, userMember2]) {
            const resAddUser = await chai.request(server).post('/api/add-user').send(user)
            utilsForTests.logRequest(resAddUser.request);
            chai.expect(resAddUser, JSON.stringify(resAddUser.body)).to.have.status(HttpStatus.OK);
            user._id = resAddUser.body._id;

            const resAddSpaceMember = await chai.request(server)
                .put('/api/add-space-member')
                .send({userId: user._id, spaceId: chat.spaceId})
            utilsForTests.logRequest(resAddSpaceMember.request);
            chai.expect(resAddSpaceMember, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);

            const resAddChatMember = await chai.request(server)
                .put('/api/add-chat-member')
                .send({userId: user._id, chatId: chat._id})
            utilsForTests.logRequest(resAddChatMember.request);
            chai.expect(resAddChatMember, JSON.stringify(resAddChatMember.body)).to.have.status(HttpStatus.OK);
        }
    });

    it('send incorrect messages', async () => {
        const resSendMessage1 = await chai.request(server).post('/api/send-message').send(
            {messageText: "", chatId: utilsForTests.nonExistId, senderId: userMember1._id})
        utilsForTests.logRequest(resSendMessage1.request);
        chai.expect(resSendMessage1, JSON.stringify(resSendMessage1.body)).to.have.status(HttpStatus.BAD_REQUEST);

        const resSendMessage2 = await chai.request(server).post('/api/send-message').send(
            {messageText: "", chatId: chat._id, senderId: utilsForTests.nonExistId})
        utilsForTests.logRequest(resSendMessage2.request);
        chai.expect(resSendMessage2, JSON.stringify(resSendMessage2.body)).to.have.status(HttpStatus.BAD_REQUEST);
    });

    it('send messages', async () => {
        for (const message of messages.slice(0, -1)) {
            let messageData = {
                messageText: message,
                chatId: chat._id,
                senderId: userMember1._id,
                isNotification: false
            }
            const resSendMessage = await chai.request(server).post('/api/send-message').send(messageData)
            utilsForTests.logRequest(resSendMessage.request);
            chai.expect(resSendMessage, JSON.stringify(resSendMessage.body)).to.have.status(HttpStatus.OK);
            utilsForTests.compareObjects(resSendMessage.body, messageData, new Set(["_id", "date"]))
        }

        const resSendAnswer = await chai.request(server).post('/api/send-message').send(
            {messageText: messages.at(-1), chatId: chat._id, senderId: userMember2._id})
        utilsForTests.logRequest(resSendAnswer.request);
        chai.expect(resSendAnswer, JSON.stringify(resSendAnswer.body)).to.have.status(HttpStatus.OK);
        utilsForTests.compareObjects(resSendAnswer.body, resSendAnswer, new Set(["_id", "date"]))
    });

    it('read messages', async () => {
        const reversedMessages = messages.reverse()
        const plainReadRes = await chai.request(server)
            .get('/api/get-message-chunk').send({chatId: chat._id})
        utilsForTests.logRequest(plainReadRes.request)
        let messagesBodies = plainReadRes.body.map(b => b.messageText);
        chai.expect(messagesBodies, JSON.stringify(messagesBodies)).to.be.eql(reversedMessages);

        const thirdMessageTime = plainReadRes.body.at(2).date; // yes third => at 2
        const olderReadRes = await chai.request(server)
            .get('/api/get-message-chunk').send({chatId: chat._id, getOlderThan: thirdMessageTime})
        utilsForTests.logRequest(olderReadRes.request)
        let oldMessagesBodies = olderReadRes.body.map(b => b.messageText);
        chai.expect(oldMessagesBodies, JSON.stringify(oldMessagesBodies)).to.be.eql(reversedMessages.slice(0, 2));
    });
})
