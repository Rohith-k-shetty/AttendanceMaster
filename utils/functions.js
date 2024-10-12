const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const Year = require("../models/year");
const { User } = require("../models");

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
    { expiresIn: "24h", algorithm: "HS256" }
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
    "Session 7",
    "Session 8",
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

const insertSuperAdmin = async () => {
  const hashedPassword = await hashPassword("Welcome@123");
  const superAdminData = {
    name: "Super Admin",
    username: "superadmin",
    password: hashedPassword,
    role: "SuperAdmin",
    status: "Active",
    email: "superadmin@example.com",
    gender: "Male",
  };

  // Use findOrCreate to ensure the SuperAdmin isn't duplicated
  await User.findOrCreate({
    where: { username: superAdminData.username },
    defaults: superAdminData,
  });
};

module.exports = {
  hashPassword,
  generateUserId,
  generateToken,
  prepopulateSessions,
  prepopulateYear,
  insertSuperAdmin,
};
