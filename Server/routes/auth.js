const express = require("express");
const routes = express();
const { authValidator } = require("../middleware/validation");
const AuthController= require("../controller/authController")

routes.post("/login",authValidator.login,AuthController.login);
routes.post("/reset-password", authValidator.resetPassword, AuthController.resetPassword);

module.exports = routes;