const userModel = require("../database/models/user");
const spaceModel = require("../database/models/space");
const {getSpaceById} = require("../controllers/spaceController");

class UserService {
    getUserById = async (userId) => {
        // userModel.findById(userId, function (err, user) {
        //     if (err) {
        //         return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}}
        //     } else {
        //         return user;
        //     }
        // });
        const user = await userModel.findById(userId);
        if (!user) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
        }
        return user;
    };

    addUser = async (user) => {
        await user.save();
    };

    getSpacesByUserId = async (userId) => {
        return spaceModel.find({spaceMembers: userId}).select("_id")
    }

    updateUser = async (user) => {
        let newValues = user
        delete newValues._id

        return userModel.findByIdAndUpdate(user._id, {$set: newValues})
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
        if (!userModel.exists({_id: userId})) {
            return {error: {type: "USER_NOT_FOUND", message: `There is no user for id=${userId}`}};
        }

        const space = await spaceModel.findById(spaceId);
        if (!space) {
            return {error: {type: "SPACE_NOT_FOUND", message: `There is no space for id=${spaceId}`}};
        }

        if (space.spaceMembers.includes(userId)) {
            return {
                error: {type: "FAILED_TO_ADD_SPACE_MEMBER", message: `The user ${userId} is already ${spaceId} member`},
            };
        }
        space.spaceMembers.push(userId);
        await space.save();
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
