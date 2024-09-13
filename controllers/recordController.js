const { AttendanceRecord } = require("../models/recordModel");
const { AttendanceBook } = require("../models/bookModel");

/**
 * Insert attendance records into the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

const insertAttendanceRecord = async (req, res) => {
  const { bookId, studentId, date, attendanceStatus } = req.body;

  // Validate input data
  if (!bookId || !studentId || !date || !attendanceStatus) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if attendance book exists and is active
  const attendanceBook = await AttendanceBook.findOne({
    where: { id: bookId, status: "Active" },
  });
  if (!attendanceBook) {
    return res.status(404).json({
      error: `Attendance book with ID ${bookId} not found or not Active`,
    });
  }

  try {
    // Create the attendance record
    const newRecord = await AttendanceRecord.create({
      bookId,
      studentId,
      date,
      attendanceStatus,
    });

    return res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to create attendance record" });
  }
};

const insertAttendanceRecordsArray = async (req, res) => {
  const attendanceRecords = req.body;

  // Validate input data
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res
      .status(400)
      .json({ error: "Attendance records should be a non-empty array" });
  }

  try {
    // Iterate over each attendance record
    for (const record of attendanceRecords) {
      const { bookId, studentId, date, attendanceStatus } = record;

      if (!bookId || !studentId || !date || !attendanceStatus) {
        return res.status(400).json({
          error: "All fields are required for each attendance record",
        });
      }

      // Check if attendance book exists and is active
      const attendanceBook = await AttendanceBook.findOne({
        where: { id: bookId, status: "Active" },
      });
      if (!attendanceBook) {
        return res.status(404).json({
          error: `Attendance book with ID ${bookId} not found or not active`,
        });
      }

      // Create the attendance record
      await AttendanceRecord.create({
        bookId,
        studentId,
        date,
        attendanceStatus,
      });
    }

    return res
      .status(201)
      .json({ message: "Attendance records created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to create attendance records" });
  }
};

const updateSingleAttendanceRecord = async (req, res) => {
  const { recordId } = req.params;
  const { attendanceStatus } = req.body;

  // Validate input data
  if (!attendanceStatus) {
    return res.status(400).json({ error: "Attendance status is required" });
  }

  try {
    // Find the attendance record by ID
    const attendanceRecord = await AttendanceRecord.findByPk(recordId);
    if (!attendanceRecord) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    // Update the attendance status
    attendanceRecord.attendanceStatus = attendanceStatus;
    await attendanceRecord.save();

    return res.status(200).json({
      message: "Attendance record updated successfully",
      attendanceRecord,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to update attendance record" });
  }
};

const updateMultipleAttendanceRecords = async (req, res) => {
  const attendanceUpdates = req.body;

  // Validate input data
  if (!Array.isArray(attendanceUpdates) || attendanceUpdates.length === 0) {
    return res
      .status(400)
      .json({ error: "Attendance updates should be a non-empty array" });
  }

  try {
    // Iterate over each update record
    for (const update of attendanceUpdates) {
      const { recordId, attendanceStatus } = update;

      if (!recordId || !attendanceStatus) {
        return res.status(400).json({
          error: "Record ID and attendance status are required for each update",
        });
      }

      // Find the attendance record by ID
      const attendanceRecord = await AttendanceRecord.findByPk(recordId);
      if (!attendanceRecord) {
        return res
          .status(404)
          .json({ error: `Attendance record with ID ${recordId} not found` });
      }

      // Update the attendance status
      attendanceRecord.attendanceStatus = attendanceStatus;
      await attendanceRecord.save();
    }

    return res
      .status(200)
      .json({ message: "Attendance records updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to update attendance records" });
  }
};

module.exports = {
  insertAttendanceRecordsArray,
  insertAttendanceRecord,
  updateSingleAttendanceRecord,
  updateMultipleAttendanceRecords,
};
