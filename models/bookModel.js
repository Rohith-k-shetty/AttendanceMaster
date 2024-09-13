// app/models/user.js

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");
const Department = require("./departmentModel");
const Subject = require("./subjectModel");
const Semister = require("./semisterModel");

class AttendenceBook extends Model {}

AttendenceBook.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    bookCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bookName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Department,
        key: "id",
      },
    },
    semisterId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Semister,
        key: "id",
      },
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AttendenceBook",
    tableName: "tblAttendenceBook",
  }
);

AttendenceBook.belongsTo(Semister, { foreignKey: "semisterId", as:"semister" });
AttendenceBook.belongsTo(Subject, { foreignKey: "subjectId" , as:"subject" });
AttendenceBook.belongsTo(Department, { foreignKey: "departmentId", as: "department" });
// AttendenceBook.belongsTo(Teacher, { foreignKey: "teacherId" });

module.exports = AttendenceBook;
