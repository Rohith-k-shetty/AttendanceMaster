const express = require("express");
const router = express.Router();
const {
  createDepartment,
  deleteDepartment,
  updateDepartment,
  searchDepartments,
  searchDepartmentsByRegex,
  createSubject,
  updateSubject,
  deleteSubject,
  searchSubject,
  searchSubjectsByRegx,
  getDepartmentById,
  getSubjectById,
  createCourse,
  deleteCourse,
  updateCourse,
  searchCourses,
  searchCoursesByRegex,
  getCourseById,
  getAllDepartments,
  getAllSubjects,
  getAllCourses,
  getAllYears,
  getAllSessions,
} = require("../controllers/verticalController");
const { verifyToken } = require("../middleware/tokenMiddleware");

// department routes
router.post("/department", verifyToken, createDepartment);
router.delete("/department/:id", verifyToken, deleteDepartment);
router.put("/department/:id", verifyToken, updateDepartment);
router.get("/department/search", verifyToken, searchDepartments);
router.get("/department/searchByRegx", verifyToken, searchDepartmentsByRegex);
router.get("/department/getById/:id", verifyToken, getDepartmentById);
router.get("/department/getAll", verifyToken, getAllDepartments);

//subject routes
router.post("/subject", verifyToken, createSubject);
router.delete("/subject/:id", verifyToken, deleteSubject);
router.put("/subject/:id", verifyToken, updateSubject);
router.get("/subject/search", verifyToken, searchSubject);
router.get("/subject/searchByregx", verifyToken, searchSubjectsByRegx);
router.get("/subject/getById/:id", verifyToken, getSubjectById);
router.get("/subject/getAll", verifyToken, getAllSubjects);

// course routes
router.post("/course", verifyToken, createCourse);
router.delete("/course/:id", verifyToken, deleteCourse);
router.put("/course/:id", verifyToken, updateCourse);
router.get("/course/search", verifyToken, searchCourses);
router.get("/course/searchByRegex", verifyToken, searchCoursesByRegex);
router.get("/course/getById/:id", verifyToken, getCourseById);
router.get("/course/getAll", verifyToken, getAllCourses);

router.get("/year/getAll", verifyToken, getAllYears);
router.get("/session/getAll", verifyToken, getAllSessions);

module.exports = router;
