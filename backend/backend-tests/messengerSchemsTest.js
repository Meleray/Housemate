const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const utilsForTests = require("./utilsForTests");
const server = 'localhost:5001';

chai.use(chaiHttp);


describe('Chat and Message schemes', () => {
    let spaceId;
    let userMember1 = {
        userName: "Member First",
        userPassword: "qwerty",
        userPicture: 456,
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let userMember2 = {
        userName: "Member Second",
        userPassword: "qwerty",
        userPicture: 123,
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let userNotMember = {
        userName: "Spy",
        userPassword: "qwerty",
        userPicture: 789,
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let chat = {
        // _id: will be filled out further
        chatName: "Secret conspiracy of long humans",
        chatPicture: 127,
        // space: will be filled out further
        // chatMembers: will be filled out further
    }

    before('prepare data', async () => {
        // add a space to the DB
        const resAddSpace = await chai.request(server)
            .post('/api/add-space')
            .send({spaceName: "Another house with high ceilings"})
        utilsForTests.logRequest(resAddSpace.request);
        chai.expect(resAddSpace, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        spaceId = resAddSpace.body._id;
        chat.space = spaceId;

        // add the users to the DB and make them members of the space
        for (const user of [userMember1, userMember2]) {
            const resAddUser = await chai.request(server).post('/api/add-user').send(user)
            utilsForTests.logRequest(resAddUser.request);
            chai.expect(resAddUser, JSON.stringify(resAddUser.body)).to.have.status(HttpStatus.OK);
            user._id = resAddUser.body._id;

            const resAddMember = await chai.request(server)
                .put('/api/add-space-member')
                .send({userId: user._id, spaceId: chat.space})
            utilsForTests.logRequest(resAddMember.request);
            chai.expect(resAddMember, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        }

        // add spy who is not the spase member
        const resAddSpy = await chai.request(server).post('/api/add-user').send(userNotMember)
        utilsForTests.logRequest(resAddSpy.request);
        chai.expect(resAddSpy, JSON.stringify(resAddSpy.body)).to.have.status(HttpStatus.OK);
        userNotMember._id = resAddSpy.body._id;
    });

    it('add chat', (done) => {
        chai.request(server)
            .post('/api/add-chat')
            .send(chat)
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chat._id = res.body._id
                utilsForTests.compareObjects(res.body, chat)
                done();
            });
    });

    it('add chat to a non-exist space', (done) => {
        let fakeChat = chat;
        fakeChat.space = utilsForTests.nonExistId;  // non-existed space
        chai.request(server)
            .post('/api/add-chat')
            .send(fakeChat)
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });


    it('get chat', (done) => {
        chai.request(server)
            .get('/api/find-chat')
            .send({chatId: chat._id})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(chat._id);
                done();
            });
    });

    it("add to a chat not member of a chat's space", (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: chat._id, userId: userNotMember._id})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('add a chat member to a non-existed chat', (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: utilsForTests.nonExistId, userId: userMember1._id})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('add a chat member', (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: chat._id, userId: userMember1._id})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                // chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(chat._id);
                done();
            });
    });
})
