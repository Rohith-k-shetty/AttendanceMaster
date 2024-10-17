// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("attendanceMaster", "postgres", "12345", {
  host: process.env.HOST,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
