// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  createUser,
  bulkCreateUsers,
  updateUser,
  deleteUser,
  activateUser,
  getUser,
  getByNameOrPhone,
  searchUsersBySingleFields,
  searchUsersByArrayFields,
  resetUserPassword,
} = require("../controllers/userController");
const { checkUserRole, findingUser } = require("../middleware/userMiddleware");
const { verifyToken } = require("../middleware/tokenMiddleware");

//post operation router
router.post("/", verifyToken, findingUser, createUser);
router.post("/bulkUpload", verifyToken, bulkCreateUsers);

//put reuest router
router.put("/activate/:id", verifyToken, activateUser);
router.put("/:id", verifyToken, updateUser);
router.put("/reset-password/:id", verifyToken, resetUserPassword);

//delete request router
router.delete("/:id", verifyToken, deleteUser);

//get request router
router.get("/:id", verifyToken, getUser);
router.get("/search/byNameOrPhone", verifyToken, getByNameOrPhone);
router.get("/search/singleFeilds", verifyToken, searchUsersBySingleFields);
router.get("/search/arrayFeilds", verifyToken, searchUsersByArrayFields);

module.exports = router;
