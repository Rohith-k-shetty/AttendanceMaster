const sequelize = require("../config/db");
const { Op } = require("sequelize");
const AttendanceRecord = require("../models/AttendanceRecord");
const { attendanceStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");

const createAttendanceRecords = async (req, res) => {
  const attendanceDataArray = req.body; // Get attendance records from the request body
  const transaction = await sequelize.transaction(); // Start a new transaction

  try {
    // Prepare attendance records for bulk creation
    const recordsToCreate = attendanceDataArray.map(
      ({ attendanceBookId, studentId, date, sessionId, status }) => ({
        attendanceBookId,
        studentId,
        date,
        sessionId,
        status,
      })
    );

    // Check for existing records to avoid duplicates
    const existingRecords = await AttendanceRecord.findAll({
      where: {
        [Op.or]: recordsToCreate.map(
          ({ attendanceBookId, studentId, date, sessionId }) => ({
            attendanceBookId,
            studentId,
            date,
            sessionId,
          })
        ),
      },
      transaction,
    });

    // Create a set of existing record identifiers for quick lookup
    const existingIds = new Set(
      existingRecords.map(
        ({ attendanceBookId, studentId, date, sessionId }) =>
          `${attendanceBookId}-${studentId}-${date}-${sessionId}`
      )
    );

    // Filter out duplicates from recordsToCreate
    const uniqueRecords = recordsToCreate.filter(
      ({ attendanceBookId, studentId, date, sessionId }) =>
        !existingIds.has(
          `${attendanceBookId}-${studentId}-${date}-${sessionId}`
        )
    );

    // Bulk create unique attendance records if any exist
    if (uniqueRecords.length) {
      await AttendanceRecord.bulkCreate(uniqueRecords, { transaction });
    }

    await transaction.commit(); // Commit transaction
    return res
      .status(201)
      .json(
        formatResponse(
          201,
          "Attendance records created successfully",
          true,
          uniqueRecords,
          existingRecords.length ? existingRecords : null
        )
      );
  } catch (error) {
    await transaction.rollback(); // Rollback transaction in case of error
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
          model: Session,
          as: "session",
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

const updateAttendanceRecord = async (req, res) => {
  const { attendanceRecordId, status } = req.query; // Get attendance record ID from the request

  // Validate status input
  if (!status || ![attendanceStatus[0], attendanceStatus[1]].includes(status)) {
    return res
      .status(400)
      .json(
        formatResponse(
          400,
          "Invalid status value. Status must be 'Present' or 'Absent'.",
          false
        )
      );
  }

  try {
    // Find the attendance record by ID
    const attendanceRecord = await AttendanceRecord.findByPk(
      attendanceRecordId
    );

    // If record not found, return a 404 error
    if (!attendanceRecord) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance record not found.", false));
    }

    // Update the status of the attendance record
    attendanceRecord.status = status;
    await attendanceRecord.save(); // Save the updated record

    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Attendance record updated successfully.",
          true,
          attendanceRecord
        )
      );
  } catch (error) {
    console.error("Error updating attendance record:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update attendance record.", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  createAttendanceRecords,
  getAttendanceRecords,
  updateAttendanceRecord,
};
