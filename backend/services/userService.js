// TODO I am not an expert in js, but this relative import looks ugly
const userModel = require("../database/models/user");

class UserService {
  getProfile = async (email) => {
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        error: {
          type: "PROFILE_NOT_FOUND",
          message: "There is no profile for this email",
        },
      };
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  };

  addProfile = async (course) => {
    // this service posts a course to the database
    try {
      await course.save();
    } catch (error) {
      console.log("Error while adding course service", error.message);
    }
  };
}

module.exports = new UserService();
