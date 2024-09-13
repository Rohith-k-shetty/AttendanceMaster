const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { userStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");

//token derification middleware
const verifyToken = async (req, res, next) => {
  // Get the token from the Authorization header and remove the "Bearer " prefix if it exists
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json(formatResponse(401, "Authorization token is missing", false));
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (!decoded.user.id) {
      return res
        .status(401)
        .json(formatResponse(401, "Unauthorized Access", false));
    }
    const user = await User.findOne({
      where: {
        id: decoded.user.id,
        status: userStatus[0], // Assuming userStatus[0] is 'Active'
      },
    });
    // Check if the user exists
    if (!user) {
      return res.status(404).json(formatResponse(404, "User not found", false));
    }
    req.userRole = user.role;
    req.userId = user.id;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json(
      formatResponse(401, "Unauthorized Access", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  verifyToken,
};
