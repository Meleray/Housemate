const userModel = require("../database/models/user");
const spaceModel = require("../database/models/space");
const utilsForServices = require("./utilsForServices");
const {assertKeysValid, pick} = require("./utilsForServices");


const returnableUserFields = ['_id', 'userName', 'userEmail', 'userDescription', 'userPicture'];

class UserService {

    getUserById = async (requestBody) => {
        assertKeysValid(requestBody, ['userId'], [])
        const user = await userModel.findById(requestBody.userId)
            .select(returnableUserFields);
        if (!user) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${requestBody.userId}`}};
        }
        return user;
    };

    addUser = async (requestBody) => {
        assertKeysValid(requestBody, ['userName', 'userEmail', 'userPassword'],
            ['userDescription'])
        let user = await userModel.create(requestBody);
        return pick(user, returnableUserFields);
    };


    updateUser = async (requestBody) => {
        assertKeysValid(requestBody, ['userId'],
            ['userName', 'userEmail', 'userDescription', 'userPassword'])
        const {userId, ...updData} = requestBody;
        return userModel.findByIdAndUpdate(userId, {$set: updData}, {new: true}).select(returnableUserFields)
    }

    deleteUser = async (requestBody) => {
        assertKeysValid(requestBody, ['userId'], [])
        const userId = requestBody.userId
        let spaces = await spaceModel.find({'spaceMembers.memberId': userId})  // TODO

        if (spaces.length > 0) {
            return {
                error: {
                    type: "CAN_NOT_DELETE_USER",
                    message: `Can not delete the user while he is a member of the spaces ${spaces}`
                }
            };
        }
        let deletedUser = await userModel.findByIdAndRemove(userId).select(returnableUserFields);
        if (deletedUser == null) {
            return {
                error: {type: "CAN_NOT_DELETE_USER", message: `A user with id=${userId} does not exist`}
            };
        }
        return deletedUser
    }

}

module.exports = new UserService();
