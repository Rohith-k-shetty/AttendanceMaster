const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginController");
const { checkUserRole } = require("../middleware/userMiddleware");

//route for loging the user
router.post("/", login);

module.exports = router;
