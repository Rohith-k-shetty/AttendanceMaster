const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { AttendanceRecord, AttendanceSession } = require("../models");
const { attendanceStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");

const updateAttendanceSession = async (req, res) => {
  const { attendanceSessionId, status } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!attendanceSessionId || !status) {
      return res
        .status(400)
        .json(formatResponse(400, "Missing required parameters", false));
    }
    const attendanceSession = await AttendanceSession.findByPk(
      attendanceSessionId,
      { transaction }
    );
    if (!attendanceSession) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance session not found", false));
    }
    attendanceSession.status = status;
    await attendanceSession.save({ transaction });
    const attendanceRecord = await AttendanceRecord.findByPk(
      attendanceSession.attendanceRecordId,
      { transaction }
    );

    if (!attendanceRecord) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance record not found", false));
    }
    // Recalculate present and absent sessions
    const sessions = await AttendanceSession.findAll({
      where: { attendanceRecordId: attendanceSession.attendanceRecordId },
      transaction,
    });
    const totalSessions = sessions.length;
    const presentSessions = sessions.filter(
      (session) => session.status === attendanceStatus[0]
    ).length;
    const absentSessions = totalSessions - presentSessions;
    attendanceRecord.totalSessions = totalSessions;
    attendanceRecord.presentSessions = presentSessions;
    attendanceRecord.absentSessions = absentSessions;

    await attendanceRecord.save({ transaction });
    await transaction.commit();
    return res
      .status(200)
      .json(
        formatResponse(200, "Attendance session updated successfully", true)
      );
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error updating attendance session:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update attendance session", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  updateAttendanceSession,
};
