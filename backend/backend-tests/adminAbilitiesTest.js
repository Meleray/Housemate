const HttpStatus = require('http-status-codes');

let chai = require('chai');
let chaiHttp = require('chai-http');
const utilsForTests = require("./utilsForTests");
const server = 'localhost:5001';

chai.use(chaiHttp);


describe('Admin abilities', () => {
    let spaceId;
    let adminUser = {
        userName: "Member First", userPassword: "qwerty", userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let ordinaryUser1 = {
        userName: "Member Second", userPassword: "pas", userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let ordinaryUser2 = {
        userName: "Member Third", userPassword: "word", userEmail: `${utilsForTests.generateRandomStr()}@test.ru`
    }
    let inviteCode = null;

    before('prepare data', async () => {
        // add a space to the DB
        const resAddSpace = await chai.request(server)
            .post('/api/create-space')
            .send({spaceName: "Additional house with high ceilings"})
        chai.expect(resAddSpace, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        spaceId = resAddSpace.body._id;

        // add the users to the DB and make them members of the space
        for (const user of [adminUser, ordinaryUser1]) {
            const resAddUser = await chai.request(server).post('/api/create-user').send(user)
            chai.expect(resAddUser, JSON.stringify(resAddUser.body)).to.have.status(HttpStatus.OK);
            user._id = resAddUser.body._id;

            const resAddSpaceMember = await chai.request(server)
                .put('/api/create-space-member')
                .send({userId: user._id, spaceId: spaceId})
            chai.expect(resAddSpaceMember, JSON.stringify(resAddSpace.body)).to.have.status(HttpStatus.OK);
        }

        const resAddUser = await chai.request(server).post('/api/create-user').send(ordinaryUser2)
        chai.expect(resAddUser, JSON.stringify(resAddUser.body)).to.have.status(HttpStatus.OK);
        ordinaryUser2._id = resAddUser.body._id;
    });

    it('promote to admin', (done) => {
        chai.request(server)
            .put('/api/promote-to-admin')
            .send({userId: adminUser._id, spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);

                const expectedValue = [
                    {memberId: adminUser._id, isAdmin: true},
                    {memberId: ordinaryUser1._id, isAdmin: false}
                ]
                chai.expect(res.body.spaceMembers, JSON.stringify(res.body)).to.be.eql(expectedValue);
                done();
            });
    });

    it('promote a non-exist user to admin', (done) => {
        chai.request(server)
            .put('/api/promote-to-admin')
            .send({userId: utilsForTests.nonExistId, spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });

    it('get an invite code', (done) => {
        chai.request(server)
            .post('/api/get-invite-code')
            .send({spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body, JSON.stringify(res.body)).to.have.property("inviteCode");
                inviteCode = res.body.inviteCode
                done();
            });
    });

    it('change an invite code', (done) => {
        chai.request(server)
            .put('/api/change-invite-code')
            .send({spaceId: spaceId})
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                chai.expect(res.body, JSON.stringify(res.body)).to.have.property("inviteCode");
                chai.expect(res.body.inviteCode, JSON.stringify(res.body)).is.not.equal(inviteCode);
                inviteCode = res.body.inviteCode;
                done();
            });
    });

    it('join space', (done) => {
        chai.request(server)
            .post('/api/join-space')
            .send({
                userId: ordinaryUser2._id,
                inviteCode: inviteCode
            })
            .end((err, res) => {
                chai.expect(res, JSON.stringify(res.body)).to.have.status(HttpStatus.OK);
                done();
            });
    });
})
