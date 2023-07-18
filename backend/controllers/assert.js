const {assertKeysValid} = require("./utilsForControllers");
const spaceModel = require("../database/models/space");
const userModel = require("../database/models/user");


assertUserBelongs2Space = async function (requestBody) {
    assertKeysValid(requestBody, ['spaceId', 'userId'])
    const {spaceId, userId} = requestBody

    const condition = {
        spaceId: spaceId,
        spaceMembers: {$elemMatch: {memberId: userId}}
    }

    if (!(await spaceModel.exists(condition))) {
        throw new Error(`The user id=${userId} is not a member of the space id=${spaceId}`);
    }
};

assertUserExist = async function (requestBody) {
    assertKeysValid(requestBody, ['userId'])

    if (!(await userModel.exists({_id: requestBody.userId}))) {
        throw new Error(`The user id=${requestBody.userId} does not exist`);
    }
}

isUserAdmin = async function (requestBody) {
    assertKeysValid(requestBody, ['userId', 'spaceId'])
    return (await spaceModel.exists(
        {
            _id: requestBody.spaceId,
            spaceMembers: {
                memberId: requestBody.userId,
                isAdmin: true
            }
        }))
}

isSpacePremium = async function (requestBody) {
    assertKeysValid(requestBody, ['spaceId'])
    return (await spaceModel.exists(
        {
            _id: requestBody.spaceId,
            premiumExpiration: {$gt: Date.now()}
        }))
}

module.exports = {assertUserBelongs2Space, assertUserExist, isUserAdmin, isSpacePremium};
