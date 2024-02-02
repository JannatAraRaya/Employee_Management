const { sendResponse } = require("../utils/responseHandler");
const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/http_codes");
const UserService = require("../service/userService");
const AuthService = require("../service/authService");

class UserController {
  async create(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the user!",
          validation
        );
      }
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
      const authenticated = await AuthService.signup(username,email,password,userId,role);
      
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
  async viewOneByID(req,res){
    try{
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get the employee Id",
          validation
        );
      }
      const{employeeId}= req.params;
      const employee=await UserService.getEmployeeById(employeeId);
      return sendResponse(res,HTTP_STATUS.OK,"Successfully get the employee data.",employee)
    }catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  async view(req,res){
    try{
      const allEmployee= await UserService.getAllEmployee();
      return sendResponse(res,HTTP_STATUS.OK,"Successfully fetched all employee data",{
        result:allEmployee,
        total:allEmployee.length
      })

    }catch (error) {
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
