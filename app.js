// server.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoute");
const verticalRoutes = require("./routes/verticalRoute");
const attendanceBookRoutes = require("./routes/attendanceBookRoute");
const attendanceRecordRoute = require("./routes/attendanceRecordRoute");
const cors = require("cors");
const syncAllModels = require("./config/syncModel");

//synchronizing the Sequilize models
syncAllModels();

//configuring the dot env files
dotenv.config();

//allow cross origin
app.use(cors());
//use the express for the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Using userRoutes
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/vertical", verticalRoutes);
app.use("/api/attendanceBook", attendanceBookRoutes);
app.use("/api/attendanceRecord", attendanceRecordRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
