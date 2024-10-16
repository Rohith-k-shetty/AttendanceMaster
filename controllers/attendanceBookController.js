const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { User } = require("../models/Index");
const { bookStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");
const { AttendanceBook } = require("../models/Index");
const { Subject } = require("../models/Index");
const { Department } = require("../models/Index");
const {
  AttendanceBookStudent,
  AttendanceBookTeacher,
} = require("../models/Index");
const { Course } = require("../models/Index");

//create a attendance book
const createAttendanceBook = async (req, res) => {
  const {
    bookName,
    bookCode,
    bookType,
    subjectId,
    departmentId,
    courseId,
    startDate,
    endDate,
    createdBy,
  } = req.body;
  try {
    // Validate subject and createdBy (User)
    const subject = await Subject.findByPk(subjectId);
    const creator = await User.findByPk(createdBy);
    if (!subject) {
      return res
        .status(400)
        .json(formatResponse(400, "Invalid subject ID", false));
    }
    if (!creator) {
      return res
        .status(400)
        .json(formatResponse(400, "Invalid creator (User) ID", false));
    }
    // Optional: Validate department if departmentId is provided
    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res
          .status(400)
          .json(formatResponse(400, "Invalid Course ID", false));
      }
    }
    // Optional: Validate department if departmentId is provided
    if (departmentId) {
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return res
          .status(400)
          .json(formatResponse(400, "Invalid department ID", false));
      }
    }

    // Create AttendanceBook
    const attendanceBook = await AttendanceBook.create({
      bookName,
      bookCode,
      bookType,
      subjectId,
      departmentId,
      courseId,
      startDate,
      endDate,
      createdBy,
    });
    // Return success response
    return res
      .status(201)
      .json(
        formatResponse(
          201,
          "Attendance Book created successfully",
          true,
          attendanceBook
        )
      );
  } catch (error) {
    console.error("Error creating Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to create Attendance Book", false, {
        error: error.message,
      })
    );
  }
};

const deleteAttendanceBook = async (req, res) => {
  const { id } = req.params;
  try {
    const attendanceBookId = parseInt(id);
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId);
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }
    attendanceBook.status = bookStatus[1];
    await attendanceBook.save();
    return res
      .status(200)
      .json(formatResponse(200, "Attendance Book deleted successfully", true));
  } catch (error) {
    console.error("Error deleting Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to delete Attendance Book", false, {
        error: error.message,
      })
    );
  }
};

const ActivateAttendanceBook = async (req, res) => {
  const { id } = req.params;
  try {
    const attendanceBookId = parseInt(id);
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId);
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }
    attendanceBook.status = bookStatus[0];
    await attendanceBook.save();
    return res
      .status(200)
      .json(
        formatResponse(200, "Attendance Book Activated successfully", true)
      );
  } catch (error) {
    console.error("Error Activating Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to Activate Attendance Book", false, {
        error: error.message,
      })
    );
  }
};

const CompleteAttendanceBook = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the attendance book by ID
    const attendanceBookId = parseInt(id);
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId);
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }
    // Update the status to "Closed"
    attendanceBook.status = bookStatus[2];
    await attendanceBook.save();
    return res
      .status(200)
      .json(
        formatResponse(200, "Attendance Book Completed successfully", true)
      );
  } catch (error) {
    console.error("Error completing Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to Complete Attendance Book", false, {
        error: error.message,
      })
    );
  }
};

const closeAttendanceBook = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the attendance book by ID
    const attendanceBookId = parseInt(id);
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId);
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }
    // Update the status to "Closed"
    attendanceBook.status = bookStatus[3];
    await attendanceBook.save();
    return res
      .status(200)
      .json(formatResponse(200, "Attendance Book closed successfully", true));
  } catch (error) {
    console.error("Error closing Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to close Attendance Book", false, {
        error: error.message,
      })
    );
  }
};

const addStudentsToAttendanceBook = async (req, res) => {
  const { attendanceBookId, studentIds } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!attendanceBookId) {
      return res
        .status(400)
        .json(formatResponse(400, "Attendance Book ID is required", false));
    }
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId, {
      transaction,
      lock: "SHARE",
    });
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }
    const existingStudents = await AttendanceBookStudent.findAll({
      where: {
        attendanceBookId,
        studentId: {
          [Op.in]: studentIds,
        },
      },
      attributes: ["studentId"],
      transaction,
    });
    const existingStudentIds = new Set(
      existingStudents.map((s) => s.studentId)
    );
    const newStudentIds = studentIds.filter(
      (id) => !existingStudentIds.has(id)
    );
    if (newStudentIds.length === 0) {
      await transaction.commit();
      return res
        .status(200)
        .json(formatResponse(200, "No new students to add", true));
    }
    const students = await User.findAll({
      where: { id: newStudentIds },
      transaction,
    });

    if (students.length === 0) {
      await transaction.rollback();
      return res
        .status(400)
        .json(formatResponse(400, "No valid student IDs provided", false));
    }
    await attendanceBook.addStudents(students, { transaction });
    await transaction.commit();
    return res
      .status(200)
      .json(formatResponse(200, "Students added successfully", true));
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding students to Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to add students", false, {
        error: error.message,
      })
    );
  }
};

const addTeachersToAttendanceBook = async (req, res) => {
  const { attendanceBookId, teacherIds } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!attendanceBookId) {
      return res
        .status(400)
        .json(formatResponse(400, "Attendance Book ID is required", false));
    }
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId, {
      transaction,
      lock: "SHARE",
    });
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }
    const existingTeachers = await AttendanceBookTeacher.findAll({
      where: {
        attendanceBookId,
        teacherId: {
          [Op.in]: teacherIds,
        },
      },
      attributes: ["teacherId"],
      transaction,
    });
    const existingTeacherIds = new Set(
      existingTeachers.map((t) => t.teacherId)
    );
    const newTeacherIds = teacherIds.filter(
      (id) => !existingTeacherIds.has(id)
    );
    if (newTeacherIds.length === 0) {
      await transaction.commit();
      return res
        .status(200)
        .json(formatResponse(200, "No new teachers to add", true));
    }
    const teachers = await User.findAll({
      where: { id: newTeacherIds },
      transaction,
    });
    if (teachers.length === 0) {
      await transaction.rollback();
      return res
        .status(400)
        .json(formatResponse(400, "No valid teacher IDs provided", false));
    }
    await attendanceBook.addTeachers(teachers, { transaction });
    await transaction.commit();
    return res
      .status(200)
      .json(formatResponse(200, "Teachers added successfully", true));
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding teachers to Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to add teachers", false, {
        error: error.message,
      })
    );
  }
};

const addUsersToAttendanceBook = async (req, res) => {
  const { attendanceBookId, teacherIds, studentIds } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (!attendanceBookId) {
      return res
        .status(400)
        .json(formatResponse(400, "Attendance Book ID is required", false));
    }
    // Find the AttendanceBook with a lock to ensure consistency
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId, {
      transaction,
      lock: "SHARE",
    });
    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }

    if (teacherIds && teacherIds.length > 0) {
      const existingTeachers = await AttendanceBookTeacher.findAll({
        where: { attendanceBookId, teacherId: { [Op.in]: teacherIds } },
        attributes: ["teacherId"],
        transaction,
        lock: "SHARE",
      });

      const existingTeacherIds = new Set(
        existingTeachers.map((t) => t.teacherId)
      );
      const newTeacherIds = teacherIds.filter(
        (id) => !existingTeacherIds.has(id)
      );

      if (newTeacherIds.length > 0) {
        const teachers = await User.findAll({
          where: { id: newTeacherIds },
          transaction,
        });

        if (teachers.length > 0) {
          await attendanceBook.addTeachers(teachers, { transaction });
        }
      }
    }

    if (studentIds && studentIds.length > 0) {
      const existingStudents = await AttendanceBookStudent.findAll({
        where: { attendanceBookId, studentId: { [Op.in]: studentIds } },
        attributes: ["studentId"],
        transaction,
        lock: "SHARE",
      });

      const existingStudentIds = new Set(
        existingStudents.map((s) => s.studentId)
      );
      const newStudentIds = studentIds.filter(
        (id) => !existingStudentIds.has(id)
      );

      if (newStudentIds.length > 0) {
        const students = await User.findAll({
          where: { id: newStudentIds },
          transaction,
        });

        if (students.length > 0) {
          await attendanceBook.addStudents(students, { transaction });
        }
      }
    }

    await transaction.commit();
    return res
      .status(200)
      .json(
        formatResponse(200, "Teachers and Students added successfully", true)
      );
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding users to Attendance Book:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to add users to Attendance Book", false, {
        error: error.message,
      })
    );
  }
};

const removeStudentFromAttendanceBook = async (req, res) => {
  const { attendanceBookId, studentId } = req.query;

  try {
    // Find the AttendanceBook
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId);

    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }

    // Find the Student (User)
    const student = await User.findByPk(studentId);

    if (!student) {
      return res
        .status(404)
        .json(formatResponse(404, "Student not found", false));
    }

    // Remove the student from the attendance book
    await attendanceBook.removeStudent(student);

    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Student removed from Attendance Book successfully",
          true
        )
      );
  } catch (error) {
    console.error("Error removing student from Attendance Book:", error);
    return res.status(500).json(
      formatResponse(
        500,
        "Failed to remove student from Attendance Book",
        false,
        {
          error: error.message,
        }
      )
    );
  }
};

const removeTeacherFromAttendanceBook = async (req, res) => {
  const { attendanceBookId, teacherId } = req.query;

  try {
    // Find the AttendanceBook
    const attendanceBook = await AttendanceBook.findByPk(attendanceBookId);

    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }

    // Find the Teacher (User)
    const teacher = await User.findByPk(teacherId);

    if (!teacher) {
      return res
        .status(404)
        .json(formatResponse(404, "Teacher not found", false));
    }

    // Remove the teacher from the attendance book
    await attendanceBook.removeTeacher(teacher);

    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Teacher removed from Attendance Book successfully",
          true
        )
      );
  } catch (error) {
    console.error("Error removing teacher from Attendance Book:", error);
    return res.status(500).json(
      formatResponse(
        500,
        "Failed to remove teacher from Attendance Book",
        false,
        {
          error: error.message,
        }
      )
    );
  }
};
const searchAttendanceBook = async (req, res) => {
  const { departmentId, courseId, status, subjectId, yearId } = req.query;
  try {
    const whereClause = {};
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
    if (courseId) {
      whereClause.courseId = courseId;
    }
    if (yearId) {
      whereClause.yearId = yearId;
    }
    if (status) {
      whereClause.status = status;
    }
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }
    // Find attendance books with the dynamic where clause
    const attendanceBooks = await AttendanceBook.findAll({
      where: whereClause,
      include: [
        { model: User, as: "teachers" },
        { model: User, as: "students" },
      ],
    });
    if (!attendanceBooks.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No attendance books found matching the provided criteria",
            false
          )
        );
    }
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Attendance books retrieved successfully",
          true,
          attendanceBooks
        )
      );
  } catch (error) {
    console.error("Error fetching attendance books:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to fetch attendance books", false, {
        error: error.message,
      })
    );
  }
};
const searchAttendanceBookByRegx = async (req, res) => {
  const { departmentId, courseId, searchTerm } = req.query;
  try {
    const whereCondition = {};
    if (departmentId) {
      whereCondition.departmentId = parseInt(departmentId, 10);
    }
    if (courseId) {
      whereCondition.courseId = parseInt(courseId, 10);
    }
    if (searchTerm) {
      whereCondition[Op.or] = [
        { bookName: { [Op.iLike]: `%${searchTerm}%` } },
        { bookCode: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    const attendanceBooks = await AttendanceBook.findAll({
      where: whereCondition,
      include: [
        { model: User, as: "teachers" },
        { model: User, as: "students" },
      ],
    });

    if (!attendanceBooks.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No attendance books found matching the search term",
            false
          )
        );
    }

    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Attendance books retrieved successfully",
          true,
          attendanceBooks
        )
      );
  } catch (error) {
    console.error("Error searching attendance books:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search attendance books", false, {
        error: error.message,
      })
    );
  }
};
const getAttendanceBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendanceBook = await AttendanceBook.findByPk(id, {
      include: [
        { model: User, as: "teachers" },
        { model: User, as: "students" },
      ],
    });

    if (!attendanceBook) {
      return res
        .status(404)
        .json(formatResponse(404, "Attendance Book not found", false));
    }

    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Attendance Book retrieved successfully",
          true,
          attendanceBook
        )
      );
  } catch (error) {
    console.error("Error fetching attendance book by ID:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to fetch attendance book", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  createAttendanceBook,
  addTeachersToAttendanceBook,
  addStudentsToAttendanceBook,
  addUsersToAttendanceBook,
  closeAttendanceBook,
  deleteAttendanceBook,
  ActivateAttendanceBook,
  CompleteAttendanceBook,
  removeStudentFromAttendanceBook,
  removeTeacherFromAttendanceBook,
  searchAttendanceBook,
  searchAttendanceBookByRegx,
  getAttendanceBookById,
};
