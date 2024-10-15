const Department = require("../models/Department");
const Subject = require("../models/Subject");
const formatResponse = require("../utils/response");
const { userStatus } = require("../utils/constants");
const { Op } = require("sequelize");
const Course = require("../models/Course");
const Session = require("../models/Session");
const Year = require("../models/Year");

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
  const { id } = req.params; // User ID from URL parameters
  const updates = req.body; // Fields to update from request body

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "Department ID is required", false));
  }

  try {
    // Find the user by ID
    const department = await Department.findByPk(id);

    if (!department) {
      return res
        .status(404)
        .json(formatResponse(404, "Department not found", false));
    }

    // Update only the fields that are provided in the request body
    await department.update(updates);

    // Return a success response
    return res
      .status(200)
      .json(
        formatResponse(200, "Department updated successfully", true, department)
      );
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update department", false, {
        error: error.message,
      })
    );
  }
};

const activeteDepartment = async (req, res) => {
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
    const { id, status, limit, offset } = req.query;

    // Construct the where condition dynamically based on provided query params
    const whereCondition = {};
    if (status) whereCondition.status = status;
    if (id) whereCondition.id = id; // Fixed from whereClause to whereCondition

    // Convert limit and offset to integers, with defaults
    const limitValue = parseInt(limit, 10) || 10; // Default to 10 if not provided
    const offsetValue = parseInt(offset, 10) || 0; // Default to 0 if not provided

    // Fetch total count of departments matching the criteria
    const totalCount = await Department.count({ where: whereCondition });

    const departments = await Department.findAll({
      where: whereCondition,
      limit: limitValue,
      offset: offsetValue,
      order: [
        ["departmentName", "ASC"], // Sort by department name in ascending order
        ["departmentCode", "ASC"], // Sort by department code in ascending order
      ],
    });

    return res.status(200).json(
      formatResponse(200, "Departments retrieved successfully", true, {
        departments,
        totalCount,
      })
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
        { departmentName: { [Op.iLike]: `%${searchTerm}%` } },
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
  const { id } = req.params; // Subject ID from URL parameters
  const updates = req.body; // Fields to update from request body

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "Subject ID is required", false));
  }

  try {
    // Find the subject by ID
    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }

    // Update only the fields that are provided in the request body
    await subject.update(updates);

    // Return a success response
    return res
      .status(200)
      .json(formatResponse(200, "Subject updated successfully", true, subject));
  } catch (error) {
    console.error("Error updating subject:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update subject", false, {
        error: error.message,
      })
    );
  }
};

const activateSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subjectId = parseInt(id);
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json(formatResponse(404, "Subject not found", false));
    }
    // Soft delete by setting the status to "Active"
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
  const { status, id, limit, offset } = req.query;

  try {
    // Construct dynamic where condition based on the query params
    const whereCondition = {};
    if (status) {
      whereCondition.status = status;
    }
    if (id) {
      whereCondition.id = id;
    }

    // Convert limit and offset to integers, with defaults
    const limitValue = parseInt(limit, 10) || 10; // Default to 10 if not provided
    const offsetValue = parseInt(offset, 10) || 0; // Default to 0 if not provided

    // Fetch total count of subjects matching the criteria
    const totalCount = await Subject.count({ where: whereCondition });

    // Fetch the subjects with the dynamic where condition and pagination
    const subjects = await Subject.findAll({
      where: whereCondition,
      include: [{ model: Department, as: "department" }],
      limit: limitValue,
      offset: offsetValue,
      order: [
        ["subjectName", "ASC"],
        [subjectCode, "Asc"],
      ], // Sort by subject name in ascending order
    });

    // Return successful response with retrieved subjects
    return res.status(200).json(
      formatResponse(200, "Subjects retrieved successfully", true, {
        subjects,
        totalCount,
      })
    );
  } catch (error) {
    console.error("Error fetching subjects:", error);
    // Return error response in case of failure
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

const updateCourse = async (req, res) => {
  const { id } = req.params; // Course ID from URL parameters
  const updates = req.body; // Fields to update from request body

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "Course ID is required", false));
  }

  try {
    // Find the course by ID
    const course = await Course.findByPk(id);

    if (!course) {
      return res
        .status(404)
        .json(formatResponse(404, "Course not found", false));
    }

    // Update only the fields that are provided in the request body
    await course.update(updates);

    // Return a success response
    return res
      .status(200)
      .json(formatResponse(200, "Course updated successfully", true, course));
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update course", false, {
        error: error.message,
      })
    );
  }
};

// Update the status of a course (activate)
const activateCourse = async (req, res) => {
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
    await course.update({ status: userStatus[0] });
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
    await course.update({ status: userStatus[1] });
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
    const { id, status, limit, offset } = req.query;

    // Construct the where condition dynamically based on provided query params
    const whereCondition = {};
    if (id) whereCondition.id = id;
    if (status) whereCondition.status = status;

    // Convert limit and offset to integers, with defaults
    const limitValue = parseInt(limit, 10) || 10; // Default to 10 if not provided
    const offsetValue = parseInt(offset, 10) || 0; // Default to 0 if not provided

    // Fetch total count of courses matching the criteria
    const totalCount = await Course.count({ where: whereCondition });

    // Fetch courses with dynamic where condition and pagination
    const courses = await Course.findAll({
      where: whereCondition,
      limit: limitValue,
      offset: offsetValue,
      order: [
        ["courseName", "ASC"], // Sort by course name in ascending order
        ["courseCode", "ASC"], // Sort by course code in ascending order
      ],
    });

    // Return successful response with retrieved courses and total count
    return res.status(200).json(
      formatResponse(200, "Courses retrieved successfully", true, {
        courses,
        totalCount,
      })
    );
  } catch (error) {
    console.error("Error searching courses:", error);
    // Return error response in case of failure
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
  activeteDepartment,
  searchDepartments,
  getDepartmentById,
  getAllDepartments,
  searchDepartmentsByRegex,
  createSubject,
  updateSubject,
  activateSubject,
  deleteSubject,
  searchSubject,
  searchSubjectsByRegx,
  getSubjectById,
  getAllSubjects,
  createCourse,
  updateCourse,
  activateCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
  searchCourses,
  searchCoursesByRegex,
  getAllYears,
  getAllSessions,
};
