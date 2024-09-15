const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const AttendanceBook = require("./AttendanceBook");

class AttendanceBookStudent extends Model {}

AttendanceBookStudent.init(
  {
    attendanceBookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttendanceBook,
        key: "id",
      },
      field: "attendanceBookId", // Ensure the column name is 'attendanceBookId'
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      field: "studentId", 
    },
  },
  {
    sequelize,
    modelName: "AttendanceBookStudent",
    tableName: "tblAttendanceBookStudents",
  }
);

module.exports = AttendanceBookStudent;
