const express = require("express");
const routes = express();
const UserController = require("../controller/userController");


routes.post("/create",  UserController.create);
routes.get("/get/:employeeId",  UserController.viewOneByID);
routes.get("/get",  UserController.view);

module.exports = routes;