const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const AttendanceBook = require("./attendanceBookModel");
const User = require("./userModel");

class AttendanceRecord extends Model {}

AttendanceRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attendanceBookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttendanceBook,
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    session: {
      type: DataTypes.ARRAY, 
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AttendanceRecord",
    tableName: "tblAttendanceRecords",
    timestamps: true,
  }
);

module.exports = AttendanceRecord;
