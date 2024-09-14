const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const AttendanceBook = require("./AttendanceBook");

class AttendanceBookTeacher extends Model {}

AttendanceBookTeacher.init(
  {
    attendanceBookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttendanceBook,
        key: "id",
      },
      field: "attendanceBookId", 
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      field: "teacherId", 
    },
  },
  {
    sequelize,
    modelName: "AttendanceBookTeacher",
    tableName: "tblAttendanceBookTeachers",
  }
);

module.exports = AttendanceBookTeacher;
