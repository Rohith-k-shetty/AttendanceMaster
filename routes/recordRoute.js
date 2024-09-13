const express = require("express");
const {
  updateSingleAttendanceRecord,
  insertAttendanceRecordsArray,
  updateMultipleAttendanceRecords,
} = require("../controllers/recordController");

const router = express.Router();
router.post("/", insertAttendanceRecordsArray);

// Route for updating a single attendance record
router.put("/:recordId", updateSingleAttendanceRecord);

// Route for updating multiple attendance records
router.put("/updateAll", updateMultipleAttendanceRecords);

module.exports = router;
