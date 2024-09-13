const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/tokenMiddleware");
const { insertStudentBooks } = require("../controllers/studentBookController");

//route for loging the user
router.post("/insert", verifyToken, insertStudentBooks);

module.exports = router;
