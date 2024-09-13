const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      unique: true,
    },
    departmentCode: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },

  {
    sequelize,
    modelName: "Department",
    tableName: "tblDepartments",
  }
);

module.exports = Department;
