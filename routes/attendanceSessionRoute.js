
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/tokenMiddleware");
const { updateAttendanceSession } = require("../controllers/attendanceSessionController");

router.put("/update", verifyToken, updateAttendanceSession)



module.exports = router;

