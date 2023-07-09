const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const utilsForTests = require("./utilsForTests");
const server = 'localhost:5001';

chai.use(chaiHttp);


describe('Chat system', () => {
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
    let userNotMember = {
        userName: "Spy",
        userPassword: "qwerty",
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let chat = {
        // _id: will be filled out further
        chatName: "Secret conspiracy of long humans", // will be changed
        // spaceId: will be filled out further
        // chatMembers: will be filled out further
    }

    before('prepare data', async () => {
        // add a space to the DB
        const resAddSpace = await chai.request(server)
            .post('/api/create-space')
            .send({spaceName: "Another house with high ceilings"})
        chai.expect(resAddSpace, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        chat.spaceId = resAddSpace.body._id;

        // add the users to the DB and make them members of the space
        for (const user of [userMember1, userMember2]) {
            const resAddUser = await chai.request(server).post('/api/create-user').send(user)
            chai.expect(resAddUser, JSON.stringify(resAddUser.body)).to.have.status(HttpStatus.OK);
            user._id = resAddUser.body._id;

            const resAddMember = await chai.request(server)
                .put('/api/create-space-member')
                .send({userId: user._id, spaceId: chat.spaceId})
            chai.expect(resAddMember, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        }

        // add spy who is not the spase member
        const resAddSpy = await chai.request(server).post('/api/create-user').send(userNotMember)
        chai.expect(resAddSpy, JSON.stringify(resAddSpy.body)).to.have.status(HttpStatus.OK);
        userNotMember._id = resAddSpy.body._id;
    });

    it('add chat', (done) => {
        chai.request(server)
            .post('/api/create-chat')
            .send(chat)
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chat._id = res.body._id
                utilsForTests.compareObjects(res.body, chat)
                done();
            });
    });

    it('add chat to a non-exist space', (done) => {
        let fakeChat = structuredClone(chat);
        fakeChat.spaceId = utilsForTests.nonExistId;  // non-existed space
        chai.request(server)
            .post('/api/create-chat')
            .send(fakeChat)
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });


    it('get chat', (done) => {
        chai.request(server)
            .post('/api/find-chat')
            .send({chatId: chat._id})
            .end((err, res) => {
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
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('add a chat member to a non-existed chat', (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: utilsForTests.nonExistId, userId: userMember1._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('add a chat member', (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: chat._id, userId: userMember1._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body.chatMembers, JSON.stringify(res.body)).to.be.eql([userMember1._id]);
                done();
            });
    });

    it('add the same chat member twice', (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: chat._id, userId: userMember1._id})
            .end((err, res) => {
                chai.expect(res.body.chatMembers, JSON.stringify(res.body)).to.be.eql([userMember1._id]);
                done();
            });
    });

    it('add the second chat member', (done) => {
        chai.request(server)
            .put('/api/add-chat-member')
            .send({chatId: chat._id, userId: userMember2._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body.chatMembers, JSON.stringify(res.body)).to.be.eql(
                    [userMember1._id, userMember2._id]);
                done();
            });
    });

    it('get chats by spaceId and userId', (done) => {
        chai.request(server)
            .post('/api/find-chats-by-space-and-userid')
            .send({spaceId: chat.spaceId, userId: userMember1._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                const chatIds = res.body.map(chat => chat._id)
                chai.expect(chatIds, JSON.stringify(res.body)).to.be.eql([chat._id]);
                done();
            });
    });

    it('find chat members', (done) => {
        chai.request(server)
            .post('/api/find-chat-members')
            .send({chatId: chat._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                console.log(res.body)
                utilsForTests.compareObjects(res.body.chatMembers[0], userMember1,
                    new Set(["usrPicture", "userPassword", "userEmail"]))
                utilsForTests.compareObjects(res.body.chatMembers[1], userMember2,
                    new Set(["usrPicture", "userPassword", "userEmail"]))
                done();
            });
    });

    it('update chat', (done) => {
        let newName = "The longest"
        chai.request(server)
            .put('/api/update-chat')
            .send({_id: chat._id, chatName: newName})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body.chatName, JSON.stringify(res.body)).to.be.eql(newName);
                done();
            });
    });

    it('delete a chat member', (done) => {
        chai.request(server)
            .delete('/api/delete-chat-member')
            .send({chatId: chat._id, userId: userMember2._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body.chatMembers, JSON.stringify(res.body)).to.not.include(userMember2._id);
                done();
            });
    });
})
