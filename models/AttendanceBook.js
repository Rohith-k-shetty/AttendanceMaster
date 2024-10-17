const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const Department = require("./Department");
const Subject = require("./Subject");
const User = require("./User");
const Course = require("./Course");

class AttendanceBook extends Model {}

AttendanceBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookType: {
      type: DataTypes.ENUM("Theory", "Practicals"),
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Department,
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Course,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "AttendanceBook",
    tableName: "tblAttendanceBooks",
    timestamps: true,
  }
);

module.exports = AttendanceBook;
