const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

//Function to get the hashed password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
}

// Function to generate ID
async function generateUserId() {
  const userId = uuidv4();
  return userId;
}

const generateToken = (user) => {
  const token = jwt.sign(
    {
      user
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h", algorithm: "HS256" }
  );
  return token;
};

module.exports = { hashPassword, generateUserId, generateToken };
