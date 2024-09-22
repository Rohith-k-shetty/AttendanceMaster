// server.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoute");
const verticalRoutes = require("./routes/verticalRoute");
const attendanceBookRoutes = require("./routes/attendanceBookRoute");
const attendanceRecordRoute = require("./routes/attendanceRecordRoute");
const attendanceSessionRoute = require("./routes/attendanceSessionRoute")
const cors = require("cors");
const syncAllModels = require("./config/syncModel");

//synchronizing the Sequilize models
syncAllModels();

//configuring the dot env files
dotenv.config();

//use the express for the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Using userRoutes
app.use("/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/vertical", verticalRoutes);
app.use("/attendanceBook", attendanceBookRoutes);
app.use("/attendanceRecord", attendanceRecordRoute);
app.use("/attendanceSession",attendanceSessionRoute);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
