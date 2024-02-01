const UserModel = require("../model/userModel");

class UserService {
  async existingEmail(email) {
    const existingEmail = await UserModel.findOne({ email: email });
    return existingEmail;
  }
  async create(username, email, phone, department, role) {
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
  async getEmployeeById(employeeId) {
    const employee = await UserModel.findById({ _id: employeeId });
    if (!employee) {
      return { error: "Employee does not exist" };
    }
    return employee;
  }
  async getAllEmployee(){
    const allEmployee = await UserModel.find({})
    if(allEmployee.length===0){
      return {error:"Sorry! NO employee data found."}
    }
    return allEmployee;
  }
}

module.exports = new UserService();
