const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const Year = require("../models/year");

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
      user,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h", algorithm: "HS256" }
  );
  return token;
};

const prepopulateSessions = async () => {
  const sessions = [
    "Session 1",
    "Session 2",
    "Session 3",
    "Session 4",
    "Session 5",
    "Session 6",
  ];
  for (const sessionName of sessions) {
    await Session.findOrCreate({ where: { name: sessionName } });
  }
};

const prepopulateYear = async () => {
  const sessions = [
    "I Year",
    "II Year",
    "III Year",
    "IV Year",
    "V Year",
    "Passout",
  ];
  for (const sessionName of sessions) {
    await Year.findOrCreate({ where: { year: sessionName } });
  }
};

prepopulateSessions();
prepopulateYear();

module.exports = {
  hashPassword,
  generateUserId,
  generateToken,
};
