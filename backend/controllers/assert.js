const {assertKeysValid} = require("./utilsForControllers");
const spaceModel = require("../database/models/space");


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

module.exports = {assertUserBelongs2Space};
