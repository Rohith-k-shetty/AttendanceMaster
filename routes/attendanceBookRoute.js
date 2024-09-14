const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/tokenMiddleware");
const {
  createAttendanceBook,
  addTeachersToAttendanceBook,
  addStudentsToAttendanceBook,
  addUsersToAttendanceBook,
  deleteAttendanceBook,
  closeAttendanceBook,
  ActivateAttendanceBook,
  CompleteAttendanceBook,
  removeStudentFromAttendanceBook,
  removeTeacherFromAttendanceBook,
} = require("../controllers/attendanceBookController");

//post route for attendance book
router.post("/create", verifyToken, createAttendanceBook);
router.post("/addStudents", verifyToken, addStudentsToAttendanceBook);
router.post("/addTeachers", verifyToken, addTeachersToAttendanceBook);
router.post("/addUsers", verifyToken, addUsersToAttendanceBook);

//delete route for attendance book
router.delete("/delete/:id", verifyToken, deleteAttendanceBook);
router.delete("/remove/teacher", verifyToken, removeTeacherFromAttendanceBook);
router.delete("/remove/student", verifyToken, removeStudentFromAttendanceBook);

//put operation for attendance book
router.put("/close/:id", verifyToken, closeAttendanceBook);
router.put("/activate/:id", verifyToken, ActivateAttendanceBook);
router.put("/complete/:id", verifyToken, CompleteAttendanceBook);

//get opration for attendance book
// router.get()

module.exports = router;
