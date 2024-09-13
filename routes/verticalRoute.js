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
} = require("../controllers/verticalController");
const { verifyToken } = require("../middleware/tokenMiddleware");


// department routes
router.post("/department", verifyToken, createDepartment);
router.delete("/department/:id", verifyToken,deleteDepartment);
router.put("/department/:id",verifyToken,updateDepartment);
router.get("/department/search", verifyToken, searchDepartments);
router.get("/department/searchByRegx", verifyToken, searchDepartmentsByRegex);



//route for loging the user
// router.post("/semister", verifyToken, createSemister);
router.post("/subject", verifyToken, createSubject);
router.delete("/subject/:id", verifyToken, deleteSubject);
router.put("/subject/:id",verifyToken, updateSubject);
router.get("/subject/search" ,verifyToken, searchSubject);
router.get("/subject/searchByregx",verifyToken,searchSubjectsByRegx);

module.exports = router;
