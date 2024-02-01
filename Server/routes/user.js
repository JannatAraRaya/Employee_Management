const express = require("express");
const routes = express();
const UserController = require("../controller/userController");


routes.post("/create",  UserController.create);

module.exports = routes;