const Department = require("../models/department");
const Subject = require("../models/subject");
const formatResponse = require("../utils/response");
const { userStatus } = require("../utils/constants");
const { Op } = require("sequelize");
const Course = require("../models/course");
const Session = require("../models/session");
const Year = require("../models/year");

// vertical one - Department Controllers
const createDepartment = async (req, res) => {
  const { departmentName, departmentCode } = req.body;
  try {
    // Convert departmentCode to uppercase
    const formattedDepartmentCode = departmentCode.toUpperCase();
    // Check if the department already exists
    const existingDepartment = await Department.findOne({
      where: { departmentCode: formattedDepartmentCode },
    });
    // If the department exists, return a response
    if (existingDepartment) {
      return res
        .status(400)
        .json(formatResponse(400, "Department already exists", false));
    }
    // Create a new department with uppercase departmentCode
    const department = await Department.create({
      departmentName,
      departmentCode: formattedDepartmentCode,
    });
    // Return success response
    return res
      .status(201)
      .json(
        formatResponse(201, "Department created successfully", true, department)
      );
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to create department", false, {
        error: error.message,
      })
    );
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const departmentId = parseInt(id);
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res
        .status(404)
        .json(formatResponse(404, "Department not found", false));
    }
    await department.update({ status: userStatus[0] });
    return res
      .status(200)
      .json(formatResponse(200, "Department activated successfully", true));
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update department", false, {
        error: error.message,
      })
    );
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const departmentId = parseInt(id);
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res
        .status(404)
        .json(formatResponse(404, "Department not found", false));
    }
    await department.update({ status: userStatus[1] });
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Department deleted (status set to Inactive) successfully",
          true
        )
      );
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to delete department", false, {
        error: error.message,
      })
    );
  }
};
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "User ID is required", false));
  }
  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res
        .status(404)
        .json(formatResponse(404, "Department not found", false));
    }
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Department retrived Successfully",
          true,
          department
        )
      );
  } catch (error) {
    console.error("Error while fetching departmnent:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get department data", false, {
        error: error.message,
      })
    );
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const department = await Department.findAll();
    if (!department) {
      return res
        .status(404)
        .json(formatResponse(404, "Department not found", false));
    }
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Department retrived Successfully",
          true,
          department
        )
      );
  } catch (error) {
    console.error("Error while fetching departmnent:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get department data", false, {
        error: error.message,
      })
    );
  }
};

// Controller for searching Departments by specific fields
const searchDepartments = async (req, res) => {
  try {
    const { departmentName, departmentCode, status } = req.query;
    // Construct the where condition dynamically based on provided query params
    const whereCondition = {};
    if (departmentName) whereCondition.departmentName = departmentName;
    if (departmentCode) whereCondition.departmentCode = departmentCode;
    if (status) whereCondition.status = status;
    const departments = await Department.findAll({ where: whereCondition });
    if (!departments.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No departments found matching the criteria",
            false
          )
        );
    }
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Departments retrieved successfully",
          true,
          departments
        )
      );
  } catch (error) {
    console.error("Error searching departments:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search departments", false, {
        error: error.message,
      })
    );
  }
};

// Controller for searching Departments by a search term using regex
const searchDepartmentsByRegex = async (req, res) => {
  try {
    const { searchTerm, status } = req.query;

    // Construct the where condition dynamically based on searchTerm and status
    const whereCondition = {};

    if (status) {
      whereCondition.status = status; // Filter by status
    }

    if (searchTerm) {
      whereCondition[Op.or] = [
        { departmentName: { [Op.iLike]: `%${searchTerm}%` } }, // Case-insensitive match
        { departmentCode: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    const departments = await Department.findAll({ where: whereCondition });

    if (!departments.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No departments found matching the search term",
            false
          )
        );
    }
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Departments retrieved successfully",
          true,
          departments
        )
      );
  } catch (error) {
    console.error("Error searching departments:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search departments", false, {
        error: error.message,
      })
    );
  }
};

//subject controller functions will start from here
const createSubject = async (req, res) => {
  const { subjectName, subjectCode } = req.body;
  try {
    // Check if the subject already exists
    const existingSubject = await Subject.findOne({
      where: { subjectCode: subjectCode.toUpperCase() },
    });
    if (existingSubject) {
      return res
        .status(400)
        .json(formatResponse(400, "Subject already exists", false));
    }
    // Create the new subject
    const subject = await Subject.create({
      subjectName,
      subjectCode: subjectCode.toUpperCase(),
    });
    return res
      .status(201)
      .json(formatResponse(201, "Subject created successfully", true, subject));
  } catch (error) {
    console.error("Error creating subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to create subject", false, {
        error: error.message,
      })
    );
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subjectId = parseInt(id);
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    // Soft delete by setting the status to "Inactive"
    subject.status = userStatus[0];
    await subject.save();
    return res
      .status(200)
      .json(formatResponse(200, "Subject updated successfully", true));
  } catch (error) {
    console.error("Error deleting subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update subject", false, {
        error: error.message,
      })
    );
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subjectId = parseInt(id);
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    // Soft delete by setting the status to "Inactive"
    subject.status = userStatus[1];
    await subject.save();
    return res
      .status(200)
      .json(formatResponse(200, "Subject deleted successfully", true));
  } catch (error) {
    console.error("Error deleting subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to delete subject", false, {
        error: error.message,
      })
    );
  }
};

//request to get a single user
const getSubjectById = async (req, res) => {
  const { id } = req.params; // User ID from URL parameters

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "User ID is required", false));
  }
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    return res
      .status(200)
      .json(
        formatResponse(200, "Subject retrived Successfully", true, subject)
      );
  } catch (error) {
    console.error("Error while fetching subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get subject data", false, {
        error: error.message,
      })
    );
  }
};

//request to get a single user
const getAllSubjects = async (req, res) => {
  try {
    const subject = await Subject.findAll();
    if (!subject) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    return res
      .status(200)
      .json(
        formatResponse(200, "Subject retrived Successfully", true, subject)
      );
  } catch (error) {
    console.error("Error while fetching subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get subject data", false, {
        error: error.message,
      })
    );
  }
};

const searchSubject = async (req, res) => {
  const { status, subjectId } = req.query;
  try {
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (subjectId) {
      whereClause.id = subjectId;
    }
    // Find subjects with the dynamic where clause
    const subjects = await Subject.findAll({
      where: whereClause,
      include: [{ model: Department, as: "department" }],
    });

    if (!subjects.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No subjects found matching the provided criteria",
            false
          )
        );
    }

    return res
      .status(200)
      .json(
        formatResponse(200, "Subjects retrieved successfully", true, subjects)
      );
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to fetch subjects", false, {
        error: error.message,
      })
    );
  }
};

const searchSubjectsByRegx = async (req, res) => {
  try {
    const { departmentId, searchTerm } = req.query;
    const whereCondition = {};
    if (departmentId) {
      whereCondition.departmentId = parseInt(departmentId);
    }
    if (searchTerm) {
      whereCondition[Op.or] = [
        { subjectCode: { [Op.iLike]: `%${searchTerm}%` } },
        { subjectName: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }
    const subjects = await Subject.findAll({
      where: whereCondition,
      include: [{ model: Department, as: "department" }],
    });

    if (!subjects.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No subjects found matching the search term",
            false
          )
        );
    }
    return res
      .status(200)
      .json(
        formatResponse(200, "Subjects retrieved successfully", true, subjects)
      );
  } catch (error) {
    console.error("Error searching subjects:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search subjects", false, {
        error: error.message,
      })
    );
  }
};

// Create a new course
const createCourse = async (req, res) => {
  const { courseName, courseCode } = req.body;
  try {
    // Convert courseCode to uppercase
    const formattedCourseCode = courseCode.toUpperCase();

    // Check if the course already exists
    const existingCourse = await Course.findOne({
      where: { courseCode: formattedCourseCode },
    });
    // If the course exists, return a response
    if (existingCourse) {
      return res
        .status(400)
        .json(formatResponse(400, "Course already exists", false));
    }

    // Create a new course with uppercase courseCode
    const course = await Course.create({
      courseName,
      courseCode: formattedCourseCode,
    });

    // Return success response
    return res
      .status(201)
      .json(formatResponse(201, "Course created successfully", true, course));
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to create course", false, {
        error: error.message,
      })
    );
  }
};

// Update the status of a course (activate)
const updateCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const courseId = parseInt(id);
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json(formatResponse(404, "Course not found", false));
    }

    // Update the course status (activate it)
    await course.update({ status: "Active" });
    return res
      .status(200)
      .json(formatResponse(200, "Course activated successfully", true));
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update course", false, {
        error: error.message,
      })
    );
  }
};

// Delete a course (soft delete by setting status to Inactive)
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const courseId = parseInt(id);
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json(formatResponse(404, "Course not found", false));
    }

    // Soft delete by setting status to "Inactive"
    await course.update({ status: "Inactive" });
    return res
      .status(200)
      .json(
        formatResponse(
          200,
          "Course deleted (status set to Inactive) successfully",
          true
        )
      );
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to delete course", false, {
        error: error.message,
      })
    );
  }
};

// Retrieve course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "Course ID is required", false));
  }
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res
        .status(404)
        .json(formatResponse(404, "Course not found", false));
    }
    return res
      .status(200)
      .json(formatResponse(200, "Course retrieved successfully", true, course));
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get course data", false, {
        error: error.message,
      })
    );
  }
};

// Retrieve course by ID
const getAllCourses = async (req, res) => {
  try {
    const course = await Course.findAll();
    if (!course) {
      return res
        .status(404)
        .json(formatResponse(404, "Course not found", false));
    }
    return res
      .status(200)
      .json(formatResponse(200, "Course retrieved successfully", true, course));
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get course data", false, {
        error: error.message,
      })
    );
  }
};

// Search for courses based on query parameters
const searchCourses = async (req, res) => {
  try {
    const { courseName, courseCode, status } = req.query;
    // Construct the where condition dynamically based on provided query params
    const whereCondition = {};
    if (courseName) whereCondition.courseName = courseName;
    if (courseCode) whereCondition.courseCode = courseCode;
    if (status) whereCondition.status = status;

    const courses = await Course.findAll({ where: whereCondition });
    if (!courses.length) {
      return res
        .status(404)
        .json(
          formatResponse(404, "No courses found matching the criteria", false)
        );
    }

    return res
      .status(200)
      .json(
        formatResponse(200, "Courses retrieved successfully", true, courses)
      );
  } catch (error) {
    console.error("Error searching courses:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search courses", false, {
        error: error.message,
      })
    );
  }
};

// Search for courses by a search term using regex
const searchCoursesByRegex = async (req, res) => {
  try {
    const { searchTerm, status } = req.query;

    // Construct the where condition dynamically based on searchTerm and status
    const whereCondition = {};

    if (status) {
      whereCondition.status = status; // Filter by status
    }

    if (searchTerm) {
      whereCondition[Op.or] = [
        { courseName: { [Op.iLike]: `%${searchTerm}%` } }, // Case-insensitive match
        { courseCode: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    const courses = await Course.findAll({ where: whereCondition });

    if (!courses.length) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No courses found matching the search term",
            false
          )
        );
    }
    return res
      .status(200)
      .json(
        formatResponse(200, "Courses retrieved successfully", true, courses)
      );
  } catch (error) {
    console.error("Error searching courses:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search courses", false, {
        error: error.message,
      })
    );
  }
};

//request to get all Session
const getAllYears = async (req, res) => {
  try {
    const year = await Year.findAll();
    if (!year) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    return res
      .status(200)
      .json(formatResponse(200, "Subject retrived Successfully", true, year));
  } catch (error) {
    console.error("Error while fetching subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get subject data", false, {
        error: error.message,
      })
    );
  }
};

//request to get a single user
const getAllSessions = async (req, res) => {
  try {
    const session = await Session.findAll();
    if (!session) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    return res
      .status(200)
      .json(
        formatResponse(200, "Subject retrived Successfully", true, session)
      );
  } catch (error) {
    console.error("Error while fetching subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get subject data", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  createDepartment,
  deleteDepartment,
  updateDepartment,
  searchDepartments,
  getDepartmentById,
  getAllDepartments,
  searchDepartmentsByRegex,
  createSubject,
  updateSubject,
  deleteSubject,
  searchSubject,
  searchSubjectsByRegx,
  getSubjectById,
  getAllSubjects,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
  searchCourses,
  searchCoursesByRegex,
  getAllYears,
  getAllSessions,
};
