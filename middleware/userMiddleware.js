// functions.js
const { Sequelize } = require("sequelize");
const User = require("../models/User");
const { userRoles, userStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");

function checkUserRole(req, res, next) {
  const { role } = req.body;
  const userRole = req.userRole;
  if (userRole === userRoles[0]) {
    next();
  } else if (role === userRoles[1] && userRole === userRoles[1]) {
    next();
  } else {
    res
      .status(403)
      .json(
        formatResponse(403, userRole + " not allowed to create " + role, false)
      );
  }
}

const findingUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res
        .status(400)
        .json(formatResponse(400, "Username is required", false));
    }

    const user = await User.findOne({
      where: {
        username: username,
        status: userStatus[0],
      },
    });

    if (user) {
      return res
        .status(409)
        .json(formatResponse(409, "User already exists", false, { user }));
    } else {
      return next();
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json(
      formatResponse(500, "Internal server error", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  checkUserRole,
  findingUser,
};
