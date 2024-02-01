
const UserModel = require("../model/userModel");

class UserService {
  async existingEmail(email) {
    const existingEmail = await UserModel.findOne({ email: email });
    return existingEmail;
  }

  async create(username, email,  phone, department,role,) {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const user = await UserModel.create({
      username: username,
      email: email,     
      phone: phone,
      department: department,
      role: role,
      employeeId: randomId,
    });

    return user;
  }
}

module.exports = new UserService();
