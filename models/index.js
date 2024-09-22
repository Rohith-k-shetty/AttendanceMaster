const AttendanceBook = require("./AttendanceBook");
const AttendanceBookStudent = require("./AttendanceBookStudent");
const AttendanceBookTeacher = require("./AttendanceBookTeacher");
const AttendanceRecord = require("./attendanceRecord");
const AttendanceSession = require("./attendanceSession");
const Session = require("./Session");
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

// One-to-many relationship between AttendanceRecord and AttendanceSession
AttendanceRecord.hasMany(AttendanceSession, {
  foreignKey: "attendanceRecordId", // foreign key in AttendanceSession
  as: "sessions",
});

AttendanceSession.belongsTo(AttendanceRecord, {
  foreignKey: "attendanceRecordId", // foreign key in AttendanceSession
  as: "attendanceRecord",
});

// One-to-many relationship between Session and AttendanceSession
Session.hasMany(AttendanceSession, {
  foreignKey: "sessionId", // foreign key in AttendanceSession
  as: "attendanceSessions",
});

AttendanceSession.belongsTo(Session, {
  foreignKey: "sessionId", // foreign key in AttendanceSession
  as: "session",
});

module.exports = {
  AttendanceBook,
  AttendanceBookTeacher,
  AttendanceBookStudent,
  AttendanceRecord,
  AttendanceSession,
  Session,
  User,
};
