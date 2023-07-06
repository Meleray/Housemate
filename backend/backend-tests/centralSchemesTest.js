const HttpStatus = require('http-status-codes');
const utilsForTests = require("./utilsForTests");

let chai = require('chai');
let chaiHttp = require('chai-http');
const server = 'localhost:5001';


chai.use(chaiHttp);

describe('User and Space schemes', () => {

    let initialUser = {
        userName: "Mikhail",
        userDescription: "The longest human",
        userPassword: "qwerty",
        userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
        // initialUser._id will be set further
    }
    let updatedUserFields = {
        userName: "Mikhail Looong",
        userDescription: "The longest human in the universe",
    }
    let spaceId;

    it('add user', (done) => {
        chai.request(server)
            .post('/api/create-user')
            .send(initialUser)
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);

                utilsForTests.compareObjects(res.body, initialUser, new Set(["_id", "userPassword"]))
                initialUser._id = res.body._id
                done();
            });
    });

    it('add user with duplicated email', (done) => {
        let userCopy = structuredClone(initialUser)
        delete userCopy._id
        chai.request(server)
            .post('/api/create-user')
            .send(userCopy)
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });


    it('update user', (done) => {
        chai.request(server)
            .put('/api/update-user')
            .send({userId:  initialUser._id, ...updatedUserFields})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                let responseUser = res.body
                for (let key in responseUser) {
                    if (key in updatedUserFields) {  // check that all the fields of updatedUserFields are updated
                        chai.expect(responseUser[key], JSON.stringify(res.body)).to.be.eql(updatedUserFields[key]);
                    } else if (key in initialUser) {
                        // check that all the fields, which was not in updatedUserFields, are still the same
                        chai.expect(responseUser[key], JSON.stringify(res.body)).to.be.eql(initialUser[key])
                    }
                }
                done();
            });
    });

    it('get user', (done) => {
        chai.request(server)
            .post('/api/find-user')
            .send({userId: initialUser._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(initialUser._id);
                done();
            });
    });


    it('add space', (done) => {
        chai.request(server)
            .post('/api/create-space')
            .send({spaceName: "A house with high ceilings"})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                spaceId = res.body._id
                done();
            });
    });


    it('get space', (done) => {
        chai.request(server)
            .post('/api/find-space')
            .send({spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body._id, JSON.stringify(res.body)).to.be.eql(spaceId);
                done();
            });
    });

    it('add a non-exist user to a space', (done) => {
        chai.request(server)
            .put('/api/create-space-member')
            .send({userId: utilsForTests.nonExistId, spaceId: spaceId})  // fake userId
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('add a user to a non-exist space', (done) => {
        chai.request(server)
            .put('/api/create-space-member')
            .send({userId: initialUser._id, spaceId: utilsForTests.nonExistId})  // fake userId
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('add a user to a space', (done) => {
        chai.request(server)
            .put('/api/create-space-member')
            .send({userId: initialUser._id, spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);

                const expectedValue = [{memberId: initialUser._id, isAdmin: false}]
                chai.expect(res.body.spaceMembers, JSON.stringify(res.body)).to.be.eql(expectedValue);
                done();
            });
    });

    it('find spaces by userid', (done) => {
        chai.request(server)
            .post('/api/find-spaces-by-userid')
            .send({userId: initialUser._id})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body[0].spaceMembers, JSON.stringify(res.body)).to.be.eql(
                    [{ memberId: initialUser._id, isAdmin: false } ]);
                done();
            });
    });

    it('delete a user who is a space member', (done) => {
        chai.request(server)
            .delete('/api/delete-user')
            .send({userId: initialUser._id})
            .end((err, res) => {
                // we can not delete a user who is a space member
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('delete user from space', (done) => {
        chai.request(server)
            .delete('/api/delete-space-member')
            .send({userId: initialUser._id, spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body.spaceMembers, JSON.stringify(res.body)).to.be.eql([]);
                done();
            });
    })

    it('delete a user', (done) => {
        chai.request(server)
            .delete('/api/delete-user')
            .send({userId: initialUser._id})
            .end((err, res) => {
                // we can not delete a user if he is not in any space
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                done();
            });
    });

    it('delete a not existed user', (done) => {
        chai.request(server)
            .delete('/api/delete-user')
            .send({userId: utilsForTests.nonExistId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});
