const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const Department = require("../models/departmentModel.js");
const Year = require("./yearModal.js");
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Department,
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Year,
        key: "id",
      },
    },
    parentPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // gender: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    parentEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "tblUsers",
    timestamps: true,
  }
);
User.belongsTo(Department, { foreignKey: "departmentId", as: "department" });
User.belongsTo(Year, { foreignKey: "yearId", as: "year" });

module.exports = User;
