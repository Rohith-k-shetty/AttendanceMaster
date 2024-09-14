// models/index.js
const AttendanceBook = require("./AttendanceBook");
const AttendanceBookStudent = require("./AttendanceBookStudent");
const AttendanceBookTeacher = require("./attendanceBookTeacher");
const User = require("./user");

// Many-to-many relationship for teachers
AttendanceBook.belongsToMany(User, {
  through: AttendanceBookTeacher,
  as: "teachers",
  foreignKey: "attendanceBookId", // foreign key in the AttendanceBookTeacher table
  otherKey: "teacherId", // references teacherId in AttendanceBookTeacher
});

// Many-to-many relationship for students
AttendanceBook.belongsToMany(User, {
  through: AttendanceBookStudent,
  as: "students",
  foreignKey: "attendanceBookId", // foreign key in the AttendanceBookStudent table
  otherKey: "studentId", // references studentId in AttendanceBookStudent
});

module.exports = {
  AttendanceBook,
  AttendanceBookTeacher,
  AttendanceBookStudent,
  User,
};
