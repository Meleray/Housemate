const userModel = require("../database/models/user");
const spaceModel = require("../database/models/space");

class UserService {
    getUserById = async (userId) => {
        const user = await userModel.findById(userId);
        if (!user) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
        }
        return user;
    };

    addUser = async (userData) => {
        try {
            return await userModel.create(userData);
        } catch (err) {
            return {error: {type: "FAILED_TO_ADD_USER", message: err.message}};
        }
    };

    getSpacesByUserId = async (userId) => {
        return spaceModel.find({spaceMembers: userId}).select("_id")
    }

    updateUser = async (userData) => {
        let validUpdKeys = ['userPassword', 'userDescription', 'userEmail', 'userName'];
        let updValues = structuredClone(userData)
        delete updValues._id
        Object.keys(updValues).forEach((key) => {
            if (!validUpdKeys.includes(key)) {
                return {
                    error: {type: "FAILED_TO_UPDATE_USER", message: `The field '${key}' can not be updated`}
                }
            }
        });
        return userModel.findByIdAndUpdate(userData._id, {$set: updValues}, {new: true})
    }

    deleteUser = async (userId) => {
        let spaces = await this.getSpacesByUserId(userId);
        if (spaces.length > 0) {
            return {
                error: {
                    type: "CAN_NOT_DELETE_USER",
                    message: `Can not delete the user while he is a member of the spaces ${spaces}`
                }
            };
        }
        let deletedUser = await userModel.findByIdAndRemove(userId);
        if (deletedUser == null) {
            return {
                error: {type: "CAN_NOT_DELETE_USER", message: `A user with id=${spaces} does not exist`}
            };
        }
        return deletedUser
    }

    addUserToSpace = async (userId, spaceId) => {
        if (!(await userModel.exists({_id: userId}))) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
        }
        const space = await spaceModel.findByIdAndUpdate(spaceId,
            {$addToSet: {spaceMembers: userId}}, // update 'spaceMembers' only if userId is not presented in it
            {new: true}
        )
        if (!space) {
            return {
                error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}
            }
        }
        await space.save()
        return this.getSpacesByUserId(userId);  // return spaces of the user
    }

    deleteUserFromSpace = async (userId, spaceId) => {
        const space = await spaceModel.findById(spaceId);
        if (!space) {
            return {error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}};
        }
        space.spaceMembers.pull(userId);
        await space.save();
        return this.getSpacesByUserId(userId);  // return spaces of the user
    }

}

module.exports = new UserService();
