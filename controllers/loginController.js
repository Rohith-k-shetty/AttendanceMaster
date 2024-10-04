const sequelize = require("../config/db");
const User = require("../models/user");
const { generateToken } = require("../utils/functions");
const bcrypt = require("bcrypt");
const { userStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");
const Department = require("../models/department");
const Course = require("../models/course");

// Login function for the user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user by username and status
    const user = await User.findOne({
      where: {
        username: username,
        status: userStatus[0],
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(formatResponse(404, "Invalid Credentials", false));
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(formatResponse(401, "Invalid Credentials", false));
    }

    // Generate and return token
    const token = generateToken(user);
    return res
      .status(200)
      .json(formatResponse(200, "Login successful", true, { token }));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(
      formatResponse(500, "Internal server error", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  login,
};
