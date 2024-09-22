const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const AttendanceBook = require("./AttendanceBook");
const User = require("./user");

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
      references:{
        model:AttendanceBook,
        key:"id"
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:User,
        key:"id"
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalSessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    presentSessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    absentSessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "AttendanceRecord",
    tableName: "tblAttendanceRecords",
    timestamps: true,
    // Add unique constraint to prevent duplicate records for the same student, book, and date
    uniqueKeys: {
      studentBookDateUnique: {
        fields: ["attendanceBookId", "studentId", "date"],
      },
    },
  }
);

module.exports = AttendanceRecord;
