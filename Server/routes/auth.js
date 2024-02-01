const express = require("express");
const routes = express();
const AuthController= require("../controller/authController")

routes.post("/login",AuthController.login);
routes.post("/reset-password",  AuthController.resetPassword);

module.exports = routes;