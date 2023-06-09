const HttpStatus = require('http-status-codes');
const utilsForTests = require("./utilsForTests");

let chai = require('chai');
let chaiHttp = require('chai-http');
const server = 'localhost:5000';


chai.use(chaiHttp);

describe('User and Space schemes', () => {

    let userId;
    let cookie;
    let initialUser = {
        userName: "Mikhail",
        userDescription: "The longest human",
        userPassword: "qwerty",
        userPicture: 123,
        userEmail: "test131321@test.ru"
    }
    let updatedUserFields = {
        userName: "Mikhail Looong",
        userDescription: "The longest human in the universe",
    }
    let spaceId;

    it('add user', (done) => {
        chai.request(server)
            .post('/api/add-user')
            .send(initialUser)
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);

                userId = res.body.response._id

                let responseMeaningfulFields = res.body.response
                delete responseMeaningfulFields._id
                responseMeaningfulFields.userPassword = "$2a$10$iAypzWX0o/2KgEJwbEruDukbRxnhCLFgzkzTxbILu0teh.irvsyoa"
                chai.expect(responseMeaningfulFields, JSON.stringify(res.body)).to.be.eql(initialUser);
                done();
            });
    });

    it('login user', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                email: initialUser.userEmail,
                password: initialUser.userPassword
            }).end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.headers).to.have.property('set-cookie');
                cookie = res.header['set-cookie'];
                done();
            })
    })


    it('update user', (done) => {
        chai.request(server)
            .put('/api/update-user')
            .set("Cookie", cookie)
            .send(updatedUserFields)
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                let reposeUser = res.body.response
                for (let key in reposeUser) {
                    if (key in updatedUserFields) {  // check that all the fields of updatedUserFields are updated
                        chai.expect(reposeUser[key], JSON.stringify(res.body)).to.be.eql(updatedUserFields[key]);
                    } else if (key in initialUser) {
                        // check that all the fields, which was not in updatedUserFields, are still the same
                        chai.expect(reposeUser[key], JSON.stringify(res.body)).to.be.eql(initialUser[key])
                    }

                }
                done();
            });
    });


    it('get user', (done) => {
        chai.request(server)
            .get('/api/find-user')
            .set("Cookie", cookie)
            .send({userId: userId,})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(userId);
                done();
            });
    });


    it('add space', (done) => {
        chai.request(server)
            .post('/api/add-space')
            .set("Cookie", cookie)
            .send({spaceName: "A house with high ceilings"})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                spaceId = res.body.response._id
                done();
            });
    });


    it('get space', (done) => {
        chai.request(server)
            .get('/api/find-space')
            .set("Cookie", cookie)
            .send({spaceId: spaceId,})
            .end((err, res) => {
                utilsForTests.logRequest(res.request)
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(spaceId);
                done();
            });
    });


    it('add a user to a space', (done) => {
        chai.request(server)
            .put('/api/add-space-member')
            .set("Cookie", cookie)
            .send({userId: userId, spaceId: spaceId})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body, JSON.stringify(res.body)).to.be.eql([{_id: spaceId}]);
                done();
            });
    });


    it('add a user to the same space again', (done) => {
        chai.request(server)
            .put('/api/add-space-member')
            .set("Cookie", cookie)
            .send({userId: userId, spaceId: spaceId})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                // we can not add a user to a space if he is already a member of this space
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('delete a user who is a space member', (done) => {
        chai.request(server)
            .delete('/api/delete-user')
            .set("Cookie", cookie)
            .send({userId: userId})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                // we can not delete a user who is a space member
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('delete user from space', (done) => {
        chai.request(server)
            .delete('/api/delete-space-member')
            .set("Cookie", cookie)
            .send({userId: userId, spaceId: spaceId})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body, JSON.stringify(res.body)).to.be.eql([]);
                done();
            });
    })

    it('delete a user', (done) => {
        chai.request(server)
            .delete('/api/delete-user')
            .set("Cookie", cookie)
            .send({userId: userId})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                // we can not delete a user if he is not in any space
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                done();
            });
    });

    it('delete a not existed user', (done) => {
        chai.request(server)
            .delete('/api/delete-user')
            .set("Cookie", cookie)
            .send({userId: '647cec8519573b0ea70c196c'})
            .end((err, res) => {
                utilsForTests.logRequest(res.request);
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});
