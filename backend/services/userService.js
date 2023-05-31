// TODO I am not an expert in js, but this relative import looks ugly
const userModel = require("../database/models/user");

class UserService {
  getUserById = async (_id) => {
    const user = await userModel.findById( _id );
    if (!user) {
      return {
        error: {
          type: "PROFILE_NOT_FOUND",
          message: "There is no profile for this id",
        },
      };
    }
    return {
      userName: user.userName,
      userDescription: user.userDescription,
      userSpacesId: user.userSpacesId,
      userPicture: user.userPicture,
    };
  };

  addUser = async (user) => {
    try {
      await user.save();
    } catch (error) {
      console.log("Error while adding user service", error.message);
    }
  };
}

module.exports = new UserService();
