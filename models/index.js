const AttendanceBook = require("./AttendanceBook");
const AttendanceBookStudent = require("./AttendanceBookStudent");
const AttendanceBookTeacher = require("./AttendanceBookTeacher");
const AttendanceRecord = require("./attendanceRecord");
const User = require("./user");

// Many-to-many relationship for teachers
AttendanceBook.belongsToMany(User, {
  through: AttendanceBookTeacher,
  as: "teachers",
  foreignKey: "attendanceBookId", // foreign key in the AttendanceBookTeacher table
  otherKey: "teacherId", // references teacherId in AttendanceBookTeacher
});

User.belongsToMany(AttendanceBook, {
  through: AttendanceBookTeacher,
  as: "teachingBooks",
  foreignKey: "teacherId", // foreign key in the AttendanceBookTeacher table
  otherKey: "attendanceBookId", // references attendanceBookId in AttendanceBookTeacher
});

// Many-to-many relationship for students
AttendanceBook.belongsToMany(User, {
  through: AttendanceBookStudent,
  as: "students",
  foreignKey: "attendanceBookId", // foreign key in the AttendanceBookStudent table
  otherKey: "studentId", // references studentId in AttendanceBookStudent
});

User.belongsToMany(AttendanceBook, {
  through: AttendanceBookStudent,
  as: "studyingBooks",
  foreignKey: "studentId", // foreign key in the AttendanceBookStudent table
  otherKey: "attendanceBookId", // references attendanceBookId in AttendanceBookStudent
});

// One-to-Many relationship between AttendanceBook and AttendanceRecord
AttendanceBook.hasMany(AttendanceRecord, {
  foreignKey: "attendanceBookId",
  as: "attendanceRecords", // Alias for access in queries
});

AttendanceRecord.belongsTo(AttendanceBook, {
  foreignKey: "attendanceBookId",
  as: "attendanceBook", // Alias for access in queries
});

// One-to-Many relationship between User (Student) and AttendanceRecord
User.hasMany(AttendanceRecord, {
  foreignKey: "studentId",
  as: "attendanceRecords", // Alias for access in queries
});

AttendanceRecord.belongsTo(User, {
  foreignKey: "studentId",
  as: "student", // Alias for access in queries
});

module.exports = {
  AttendanceBook,
  AttendanceBookTeacher,
  AttendanceBookStudent,
  AttendanceRecord,
  User,
};
