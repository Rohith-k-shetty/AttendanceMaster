const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { AttendanceRecord, AttendanceSession } = require("../models");
const { attendanceStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");

const createAttendanceRecords = async (req, res) => {
  const attendanceDataArray = req.body;
  const transaction = await sequelize.transaction();
  try {
    const attendanceRecordsData = attendanceDataArray.map((item) => {
      const totalSessions = item.sessions.length;
      const presentSessions = item.sessions.filter(
        (session) => session.status === attendanceStatus[0]
      ).length;
      const absentSessions = totalSessions - presentSessions;

      return {
        attendanceBookId: item.attendanceBookId,
        studentId: item.studentId,
        date: item.date,
        totalSessions,
        presentSessions,
        absentSessions,
      };
    });
    const attendanceRecords = await AttendanceRecord.bulkCreate(
      attendanceRecordsData,
      {
        transaction,
        returning: true,
        updateOnDuplicate: [
          "totalSessions",
          "presentSessions",
          "absentSessions",
        ],
      }
    );
    const attendanceSessionsData = [];
    attendanceDataArray.forEach((item, index) => {
      const recordId = attendanceRecords[index].id;
      item.sessions.forEach((session) => {
        attendanceSessionsData.push({
          attendanceRecordId: recordId,
          sessionId: session.sessionId,
          status: session.status,
        });
      });
    });
    // Step 4: Insert AttendanceSession records in batches (for optimization)
    if (attendanceSessionsData.length > 0) {
      await AttendanceSession.bulkCreate(attendanceSessionsData, {
        transaction,
        ignoreDuplicates: true,
      });
    }
    await transaction.commit();
    return res
      .status(201)
      .json(
        formatResponse(201, "Attendance records created successfully", true)
      );
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error creating attendance records:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to create attendance records", false, {
        error: error.message,
      })
    );
  }
};

const getAttendanceRecords = async (req, res) => {
  const { attendanceBookId, date } = req.query; // Expecting attendanceBookId and date from the query parameters

  try {
    // Validate input
    if (!attendanceBookId) {
      return res
        .status(400)
        .json(formatResponse(400, "Missing attendanceBookId parameter", false));
    }

    // Step 1: Build the query options
    const queryOptions = {
      where: { attendanceBookId },
      include: [
        {
          model: AttendanceSession,
          as: "sessions",
          attributes: ["sessionId", "status"], // Include the relevant session data
        },
      ],
    };
    if (date) {
      queryOptions.where.date = date;
    }
    const attendanceRecords = await AttendanceRecord.findAll(queryOptions);
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Attendance records retrieved successfully",
          true,
          attendanceRecords
        )
      );
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to retrieve attendance records", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  createAttendanceRecords,
  getAttendanceRecords,
};
