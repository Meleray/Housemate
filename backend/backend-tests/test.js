const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const server = 'localhost:3000';
let should = chai.should();


chai.use(chaiHttp);

function logRequest(request) {
    const cyanColor = '\x1b[36m%s\x1b[0m'
    const message = `curl -X ${request.method.toUpperCase()} -H "Content-Type: application/json" -d '${JSON.stringify(request._data)}' ${request.url}`
    console.log(cyanColor, message);
}

describe('Data scheme', () => {

    let userId;
    let initialUser = {
        userName: "Mikhail",
        userDescription: "The longest human",
        userPassword: "qwerty",
        userPicture: 123
    }
    let updatedUserFields = {
        userName: "Mikhail Looong",
        userDescription: "The longest human in the universe",
    }
    let newSpaceId;

    describe('Test API endpoints', () => {
        it('add user', (done) => {
            chai.request(server)
                .post('/api/add-user')
                .send(initialUser)
                .end((err, res) => {
                    logRequest(res.request)
                    res.should.have.status(HttpStatus.OK);
                    userId = res.body.response._id

                    let responseMeaningfulFields = res.body.response
                    delete responseMeaningfulFields._id
                    responseMeaningfulFields.should.be.eql(initialUser)
                    done();
                });
        });


        it('update user', (done) => {
            chai.request(server)
                .put('/api/update-user')
                .send(updatedUserFields)
                .end((err, res) => {
                    logRequest(res.request)
                    res.should.have.status(HttpStatus.OK);
                    let reposeUser = res.body.response
                    for (let key in reposeUser) {
                        if (key in updatedUserFields) {  // check that all the fields of updatedUserFields are updated
                            reposeUser[key].should.be.eql(updatedUserFields[key])
                        } else if (key in initialUser) {
                            // check that all the fields, which was not in updatedUserFields, are still the same
                            reposeUser[key].should.be.eql(initialUser[key])
                        }

                    }
                    done();
                });
        });


        it('get user', (done) => {
            chai.request(server)
                .get('/api/find-user')
                .send({userId: userId,})
                .end((err, res) => {
                    logRequest(res.request)
                    res.should.have.status(HttpStatus.OK);
                    res.body._id.should.be.eql(userId);
                    done();
                });
        });


        it('add space', (done) => {
            chai.request(server)
                .post('/api/add-space')
                .send({spaceName: "A house with high ceilings"})
                .end((err, res) => {
                    logRequest(res.request)
                    res.should.have.status(HttpStatus.OK);
                    newSpaceId = res.body.response._id
                    done();
                });
        });


        it('get space', (done) => {
            chai.request(server)
                .get('/api/find-space')
                .send({spaceId: newSpaceId,})
                .end((err, res) => {
                    logRequest(res.request)
                    res.should.have.status(HttpStatus.OK);
                    res.body._id.should.be.eql(newSpaceId);
                    done();
                });
        });


        it('add a user to a space', (done) => {
            chai.request(server)
                .put('/api/add-space-member')
                .send({userId: userId, spaceId: newSpaceId})
                .end((err, res) => {
                    logRequest(res.request);
                    res.should.have.status(HttpStatus.OK);
                    res.body.should.be.eql([{_id: newSpaceId}]);
                    done();
                });
        });


        it('add a user to the same space again', (done) => {
            chai.request(server)
                .put('/api/add-space-member')
                .send({userId: userId, spaceId: newSpaceId})
                .end((err, res) => {
                    logRequest(res.request);
                    // we can not add a user to a space if he is already a member of this space
                    res.should.have.status(HttpStatus.BAD_REQUEST);
                    done();
                });
        });

        it('delete a user who is a space member', (done) => {
            chai.request(server)
                .delete('/api/delete-user')
                .send({userId: userId})
                .end((err, res) => {
                    logRequest(res.request);
                    // we can not delete a user who is a space member
                    res.should.have.status(HttpStatus.BAD_REQUEST);
                    done();
                });
        });

        it('delete user from space', (done) => {
            chai.request(server)
                .delete('/api/delete-space-member')
                .send({userId: userId, spaceId: newSpaceId})
                .end((err, res) => {
                    logRequest(res.request);
                    res.should.have.status(HttpStatus.OK);
                    res.body.should.be.eql([]);
                    done();
                });
        })

        it('delete a user', (done) => {
            chai.request(server)
                .delete('/api/delete-user')
                .send({userId: userId})
                .end((err, res) => {
                    logRequest(res.request);
                    // we can not delete a user if he is not in any space
                    res.should.have.status(HttpStatus.OK);
                    done();
                });
        });

        it('delete a not existed user', (done) => {
            chai.request(server)
                .delete('/api/delete-user')
                .send({userId: '647cec8519573b0ea70c196c'})
                .end((err, res) => {
                    logRequest(res.request);
                    res.should.have.status(HttpStatus.BAD_REQUEST);
                    done();
                });
        });
    })
});
