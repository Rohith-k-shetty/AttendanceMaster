const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/tokenMiddleware");
const { createBook } = require("../controllers/bookController");

//route for loging the user
router.post("/create", verifyToken, createBook);

module.exports = router;
