const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const AttendanceRecord = require("./attendanceRecord");
const Session = require("./Session");

class AttendanceSession extends Model {}

AttendanceSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attendanceRecordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttendanceRecord,
        key: "id",
      },
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
    modelName: "AttendanceSession",
    tableName: "tblAttendanceSessions",
    timestamps: true,
    uniqueKeys: {
      uniqueSessionPerRecord: {
        fields: ["attendanceRecordId", "sessionId"],
      },
    },
  }
);

module.exports = AttendanceSession;
