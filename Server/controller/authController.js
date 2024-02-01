const { sendResponse } = require("../utils/responseHandler");
const HTTP_STATUS = require("../constants/http_codes");
const AuthService = require("../service/authService");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const responseAuth = await AuthService.login(email, password);
      if (responseAuth) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully logged in",
          responseAuth
        );
      }
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async resetPassword(req, res) {
    try {
      const { userId, token, newPassword, confirmPassword } = req.body;
      console.log(req.body);

      const result = await AuthService.resetPassword(
        userId,
        token,
        newPassword,
        confirmPassword
      );
      console.log(result)
      if (!result.resetPassword) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated password"
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Could not update password at this moment"
      );

      // if (result) {
      //     return sendResponse(res,HTTP_STATUS.OK,result.success )
      // //   return res.status(200).json({ message: result.success });
      // } else{
      //     return sendResponse(res,HTTP_STATUS.BAD_REQUEST,result.error )
      // }
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

module.exports = new AuthController();
