const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/tokenMiddleware");
const {
  createAttendanceRecords,
  getAttendanceRecords,
  updateAttendanceRecord,
} = require("../controllers/attendanceRecordController");

router.post("/create", verifyToken, createAttendanceRecords);
router.get("/getRecords", verifyToken, getAttendanceRecords);
router.put("/update", verifyToken, updateAttendanceRecord);

module.exports = router;
