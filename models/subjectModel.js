const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const Department = require("./departmentModel");

class Subject extends Model {}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    subjectName: {
      type: DataTypes.STRING,
      unique: true,
    },
    subjectCode: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Department,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },
  {
    sequelize,
    modelName: "Subject",
    tableName: "tblSubjects",
  }
);
Subject.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

module.exports = Subject;
