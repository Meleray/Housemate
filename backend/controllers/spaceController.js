const spaceModel = require("../database/models/space");
const userModel = require("../database/models/user");
const {randomInviteCode, assertKeysValid, pick} = require("./utilsForControllers");
const {assertUserBelongs2Space, isUserAdmin, isSpacePremium} = require("./assert");


const returnableSpaceFields = ['_id', 'spaceName', 'spaceMembers', 'premiumExpiration'];

class SpaceController {
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

    getSpaceMembers = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId'], [])
        const spaceMembers = await spaceModel.findById(requestBody.spaceId).populate(
            {path: 'spaceMembers.memberId', select: ['userName', 'userPicture', 'userEmail']})
            .select(['spaceMembers', '-_id'])
        let plainSpaceMembers = []
        for (const member of spaceMembers.spaceMembers) {
            plainSpaceMembers.push({
                isAdmin: member.isAdmin,
                _id: member.memberId._id,
                userName: member.memberId.userName,
                userPicture: member.memberId.userPicture,
                userEmail: member.memberId.userEmail,
            })
        }
        return plainSpaceMembers
    }

    getSpacesByUserId = async (requestBody) => {
        assertKeysValid(requestBody, ['userId'], [])
        return spaceModel.find({'spaceMembers.memberId': requestBody.userId}).select(['_id', 'spaceName'])
    }

    addSpace = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceName'], ['spaceMembersIds'])
        let spaceData = {
            spaceName: requestBody.spaceName,
            inviteCode: randomInviteCode()
        }

        if (requestBody.hasOwnProperty('spaceMembersIds')) {
            // promote the initial members to admins
            spaceData.spaceMembers = requestBody.spaceMembersIds.map(m => ({memberId: m, isAdmin: true}))
        }
        const space = await spaceModel.create(spaceData);
        return pick(space, returnableSpaceFields);
    };

    addSpaceMember = async (requestBody) => {
        assertKeysValid(requestBody, ['spaceId', 'userId'], [])
        const {spaceId, userId} = requestBody

        // check user exist
        if (!(await userModel.exists({_id: userId}))) {
            return {error: `There is no user with id=${userId}`};
        }
        if (!(await spaceModel.exists({_id: spaceId}))) {
            return {error: `There is no space for id=${spaceId}`};
        }
        if ((await spaceModel.exists(
            {spaceId: spaceId, spaceMembers: {$elemMatch: {memberId: userId}}}
        ))) {
            return {error: `There user ${userId} is already a member of the space ${spaceId}`};
        }

        return spaceModel.findByIdAndUpdate(spaceId,
            {$push: {spaceMembers: {memberId: userId}}},
            {new: true}
        ).select('spaceMembers');
    };

    joinSpace = async (requestBody) => {
        assertKeysValid(requestBody, ['inviteCode', 'userId'], [])
        const {inviteCode, userId} = requestBody

        let space = await spaceModel.findOne({inviteCode: inviteCode}).select("spaceId")
        if (space === null) {
            return {error: `The code ${inviteCode} is invalid`}
        }
        return this.addSpaceMember({spaceId: space._id, userId: userId})
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

        await assertUserBelongs2Space({userId: userId, spaceId: spaceId})
        let filter = {_id: spaceId, spaceMembers: {$elemMatch: {memberId: userId}}}
        // '$' operator identifies an element in an array to update without explicitly specifying the position
        // https://www.mongodb.com/docs/manual/reference/operator/update/positional/
        let update = {$set: {'spaceMembers.$.isAdmin': true}}

        return spaceModel.findOneAndUpdate(filter, update, {new: true}).select('spaceMembers');
    };

    getInviteCode = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'spaceId'], [])

        // In premium version, only admin can see the invite code
        if (await isSpacePremium({spaceId: requestBody.spaceId})) {
            if (!(await isUserAdmin({userId: requestBody.userId, spaceId: requestBody.spaceId}))) {
                return {'inviteCode': 'Ask the space admin for the invite code '}
            }
        }
        return spaceModel.findById(requestBody.spaceId).select('inviteCode');
    }

    changeInviteCode = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'spaceId'], [])

        // only admin can change the invite code
        if (!(await isUserAdmin({userId: requestBody.userId, spaceId: requestBody.spaceId}))) {
            return {
                error: {
                    type: "FAILED_TO_CHANGE_INVITE_CODE", message: `Only the space admin can change the invite code`
                }
            };
        }
        const newInviteCode = randomInviteCode()
        return spaceModel.findByIdAndUpdate(
            requestBody.spaceId,
            {inviteCode: newInviteCode},
            {new: true}).select('inviteCode');
    }
}


module.exports = new SpaceController();
