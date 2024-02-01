const jsonwebtoken = require("jsonwebtoken");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");

const isAuthenticated = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Not Authorized!");
    }

    const jwtToken = req.headers.authorization.split(" ")[1];
    const validation = jsonwebtoken.verify(jwtToken, process.env.SECRET_KEY);
    if (validation) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Token Invalid!");
    }
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Please Login in Again!"
      );
    }

    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error..."
    );
  }
};
const isAdmin = (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.decode(jwtToken);
    if (!decodedToken) {
      throw new Error();
    }
    if (decodedToken.role === 'admin') {
      next();
      
    } else {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Permission Denied!!!");
    }
  } catch (error) {
    return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Authentication Error!");
  }
};
const isEmployee = (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.decode(jwtToken);
    if (!decodedToken) {
      throw new Error();
    }
    if (decodedToken.role === 'employee' ) {     
      return next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Employee is not  logged in!"
      );
    }
  } catch (error) {
    return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Authentication Error!");
  }
};
module.exports = { isAuthenticated, isAdmin, isEmployee};