const spaceModel = require("../database/models/space");
const userModel = require("../database/models/user");
const {randomInviteCode, assertKeysValid, pick} = require("./utilsForServices");
const HttpStatus = require("http-status-codes");


const returnableSpaceFields = ['_id', 'spaceName', 'spaceMembers', 'premiumExpiration'];

class SpaceService {
    getSpaceById = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId'], [])
        const space = await spaceModel.findById(requestBody.spaceId).select(returnableSpaceFields);
        if (!space) {
            return {
                error: {type: "SPACE_NOT_FOUND", message: "There is no space for this id"},
            };
        }
        return space;
    };

    getSpacesByUserId = async (requestBody) => {
        assertKeysValid(requestBody, ['userId'], [])
        return spaceModel.find({'spaceMembers.memberId': requestBody.userId}).select('_id')
    }

    addSpace = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceName'], ['spaceMembers'])
        requestBody.inviteCode = randomInviteCode()
        let space = await spaceModel.create(requestBody);
        return pick(space, returnableSpaceFields);
    };

    addSpaceMember = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId', 'userId'], [])
        const {spaceId, userId} = requestBody

        // check user exist
        if (!(await userModel.exists({_id: userId}))) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user with id=${userId}`}};
        }
        if (!(await spaceModel.exists({_id: spaceId}))) {
            return {error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}};
        }
        if ((await spaceModel.exists(
            {$and: [{_id: spaceId}, {spaceMembers: {"$in": [{memberId: userId}]}}]}
        ))) {
            return {
                error: {
                    type: "FAILED_TO_ADD_MEMBER", message: `There user ${userId} is already a member of ${spaceId}`
                }
            };
        }

        return spaceModel.findByIdAndUpdate(spaceId,
            {$push: {spaceMembers: {memberId: userId}}},
            {new: true}
        ).select('spaceMembers');
    };

    createSpaceAndAddUser = async (requestBody) => {
        // todo assert
        const {userId, ...spaceData} = requestBody
        const space = await this.addSpace(spaceData)

        return this.addSpaceMember({spaceId: space._id, userId: userId});
    }

    joinSpace = async (requestBody) => {
        assertKeysValid(requestBody, ['inviteCode', 'userId'], [])
        const {inviteCode, userId} = requestBody

        let spaceId = await spaceModel.findOne({inviteCode: inviteCode})
        if (spaceId === null) {
            return {error: {type: "INVALID_INVITE_CODE", message: `The code ${inviteCode} is invalid`}}
        }
        return this.addSpaceMember({spaceId: spaceId, userId: userId})
    }

    deleteSpaceMember = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId', 'userId'], [])
        const {spaceId, userId} = requestBody

        const space = await spaceModel.findByIdAndUpdate(spaceId, {
            $pull: {spaceMembers: {memberId: userId}}  // update 'spaceMembers' only if userId is not presented in it
        }, {new: true}).select('spaceMembers')
        if (!space) {
            return {
                error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}
            }
        }
        return space;
    };

    promoteToAdmin = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId', 'userId'], [])
        const {spaceId, userId} = requestBody

        // check user exist
        if (!(await spaceModel.exists({_id: spaceId, spaceMembers: {"$in": [{memberId: userId}]}}))) {
            return {
                error: {type: "FAILED_TO_UPGRADE_TO_ADMIN", message: `The user ${userId} is not a member of ${spaceId}`}
            };
        }

        let filter = {_id: spaceId, spaceMembers: {memberId: userId}}
        // '$' operator identifies an element in an array to update without explicitly specifying the position
        // https://www.mongodb.com/docs/manual/reference/operator/update/positional/
        let update = {$set: {'spaceMembers.$.isAdmin': true}}

        return spaceModel.findOneAndUpdate(filter, update, {new: true}).select('spaceMembers');
    };

    getInviteCode = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId'], [])
        return spaceModel.findById(requestBody.spaceId).select('inviteCode');
    }

    changeInviteCode = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId'], [])
        const newInviteCode = randomInviteCode()
        return spaceModel.findByIdAndUpdate(
            requestBody.spaceId,
            {inviteCode: newInviteCode},
            {new: true}).select('inviteCode');
    }
}


module.exports = new SpaceService();
