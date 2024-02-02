const express = require("express");
const routes = express();
const { userValidator } = require("../middleware/validation");
const UserController = require("../controller/userController");


routes.post("/create", userValidator.create, UserController.create);
routes.get("/get/:employeeId", userValidator.viewOneByID, UserController.viewOneByID);
routes.get("/get",  UserController.view);

module.exports = routes;