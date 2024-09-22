const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/tokenMiddleware");
const { createAttendanceRecords, getAttendanceRecords } = require("../controllers/attendanceRecordController");

router.post("/create",verifyToken,createAttendanceRecords);
router.get("/getRecords", verifyToken, getAttendanceRecords);


module.exports=router;