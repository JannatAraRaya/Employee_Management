const { sendResponse } = require("../utils/responseHandler");
const HTTP_STATUS = require("../constants/http_codes");
const UserService = require("../service/userService");
const AuthService = require("../service/authService");

class UserController {
  async create(req, res) {
    try {
      const { username, email, password, phone, department, role } = req.body;
      const existingEmail = await UserService.existingEmail(email);
      if (existingEmail) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "User with email already exists"
        );
      }
      const existingEmailInAuth =await AuthService.existingEmail(email);
      if (existingEmailInAuth) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Employee with this email already registered!"
        );
      }
      const user = await UserService.create(
        username,
        email,
        phone,
        department,
        role
      );
      const userId = user._id;
      console.log(userId)
      const authenticated = await AuthService.signup(username,email,password,userId,role);
      console.log(authenticated)
      if (user) {
        return sendResponse(
          res,
          HTTP_STATUS.CREATED,
          "Successfully added the user",
          user
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to add the user"
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
}

module.exports = new UserController();
