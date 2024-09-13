// syncModels.js

const sequelize = require("../config/db");
const User = require("../models/userModel");

// Define an array of all your models
const models = [User];

// Function to synchronize all models
async function syncAllModels() {
  try {
    // Sync all models
    await sequelize.sync({ force: false }); // Set force to false to not drop tables
    console.log("All models synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

module.exports = syncAllModels;
