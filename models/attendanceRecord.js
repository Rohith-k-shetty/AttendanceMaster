const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const AttendanceBook = require("./AttendanceBook");
const User = require("./user");
const Session = require("./Session");

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
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Session,
        key: "id",
      },
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
    indexes: [
      {
        unique: true,
        fields: ["attendanceBookId", "studentId", "date", "sessionId"],
      },
    ],
  }
);

module.exports = AttendanceRecord;
