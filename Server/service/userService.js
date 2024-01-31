const { validationResult } = require("express-validator");
const { sendResponse } = require("../util/common");
const UserModel = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");

class UserService {
 
    async create(username,email,role,phone,department) {
             const emailCheck = await UserModel.findOne({ email: email });
            if (emailCheck) {
                return true;
                // return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "User with email already exists");
            }
            const user = await UserModel.create({
                username:username,
                email:email,
                role:role,
                phone:phone,
                department:department    
            });
            return user;   
  
    }
}

module.exports = new UserService();