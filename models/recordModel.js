const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");
const AttendenceBook = require("./bookModel");

class AttendanceRecord extends Model {}

AttendanceRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: AttendenceBook,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    attendanceStatus: {
      type: DataTypes.ENUM("Present", "Absent", "Excused", "Late"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AttendanceRecord",
    tableName: "tblAttendanceRecords",
  }
);

module.exports = AttendanceRecord;
