const bcrypt = require("bcrypt");
const path = require("path");
const ejs = require("ejs");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const transporter = require("../config/emailHandler");
const ejsRenderFile = promisify(ejs.renderFile);
const { default: mongoose } = require("mongoose");

const AuthModel = require("../model/AuthModel");

class AuthService {
  async existingEmail(email) {
    const auth = await AuthModel.findOne({ email: email });
    return auth;
  }
  async signup(username, email, password, userId, role) {
    const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
      return hash;
    });
    const result = await AuthModel.create({
      email: email,
      password: hashedPassword,
      user: userId,
      role: role,
    });
    const auth = await AuthModel.findOne({ email: email });
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(resetToken);
    auth.resetPasswordToken = resetToken;   
    auth.resetPassword = true;
    auth.save();
    const resetURL = path.join(
      process.env.BACKEND_URL,
      "auth",
      "validate-password-reset-request",
      resetToken,
      result._id.toString()
    );

    const htmlBody = await ejsRenderFile(
      path.join(__dirname, "..", "views", "reset-password.ejs"),
      {
        name: username,
        resetURL: resetURL,
      }
    );

    const emailResult = await transporter.sendMail({
      from: "admin@bjitgroup.com",
      to: `${result.username} ${email}`,
      subject: "Account Created!!!",
      html: htmlBody,
    });

    return result;
  }
  async resetPassword(userId, token, newPassword, confirmPassword) {
    const auth = await AuthModel.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!auth) {
      return { error: "Invalid request!" };
    }
    if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
      return { error: "Invalid token" };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    if (await bcrypt.compare(newPassword, auth.password)) {
      return { error: "Password cannot be the same as the old password" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await AuthModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        password: hashedPassword,
        resetPassword: false,
        resetPasswordToken: null,
      },
      { new: true }
    );
    console.log(result)
    return result;
  }
  async login(email, password) {
    const auth = await AuthModel.findOne({ email: email })
      .populate("user", "-createdAt -updatedAt")
      .select("-createdAt -updatedAt");
    if (!auth) {
      return { error: "User is not registered" };
    }
    const checkPassword = await bcrypt.compare(password, auth.password);

    if (!checkPassword) {
      return { error: "Invalid credentials" };
    }
    const responseAuth = auth.toObject();
    delete responseAuth.password;

    const jwt = jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    responseAuth.token = jwt;
    return responseAuth;
  }
}

module.exports = new AuthService();
