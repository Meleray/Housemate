const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const utilsForTests = require("./utilsForTests");
const { use } = require('chai');
const server = 'localhost:5000';

chai.use(chaiHttp);


describe('Chat and Space schemes', () => {
    let spaceId;
    let userMember1 = {
        userName: "Member First",
        userPassword: "qwerty",
        userPicture: 456,
        userEmail: "test1@test.ru"
    }
    let userMember2 = {
        userName: "Member Second",
        userPassword: "qwerty",
        userPicture: 123,
        userEmail: "test2@test.ru"
    }
    let userNotMember = {
        userName: "Spy",
        userPassword: "qwerty",
        userPicture: 789,
        userEmail: "test3@test.ru"
    }
    let chat = {
        // chat._id will be filled out further
        chatName: "Secret conspiracy of long humans",
        chatPicture: 127,
        space: null,  // will be filled out further
        members: null,
    }

    before('prepare data', (done) => {
        // add all the users to the DB
        const tokens = new Map();
        [userMember1, userMember2, userNotMember].forEach(user => {
            console.log(user.userEmail);
            chai.request(server).post('/api/add-user').send(user)
                .end((err, res) => {
                    utilsForTests.logRequest(res.request);
                    chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                    user._id = res.body.response._id;
                });
            console.log("Added user");
            chai.request(server).post('/api/auth/login').send({
                email: user.userEmail,
                password: user.userPassword
            }).end((err, res) => {
                utilsForTests.logRequest(res.request);
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.headers).to.have.property('set-cookie');
                console.log(res.headers['set-cookie']);
                tokens.set(user.userEmail, res.headers['set-cookie'])
            });
        });
        console.log(tokens);

        // add a space to the DB
        chai.request(server)
            .post('/api/add-space')
            .set("Cookie", tokens.get('test1@test.ru'))
            .send({spaceName: "Another house with high ceilings"})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                spaceId = res.body.response._id;
                chat.space = spaceId;
                done();
            });
    });

    it('add chat', (done) => {
        chai.request(server)
            .post('/api/add-chat')
            .set("Cookie", tokens.get('test1@test.ru'))
            .send(chat)
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chat._id = res.body.response._id

                chai.expect(res.body.response, JSON.stringify(res.body)).to.be.eql(chat);
                done();
            });
    });

    it('add chat to a non-exist space', (done) => {
        let fakeChat = chat;
        fakeChat._id = "147e441b47c5186700420030"  // non-existed space
        chai.request(server)
            .post('/api/add-chat')
            .set("Cookie", tokens.get('test1@test.ru'))
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
            .set("Cookie", tokens.get('test1@test.ru'))
            .send({chatId: chat._id})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(chat._id);
                done();
            });
    });
})