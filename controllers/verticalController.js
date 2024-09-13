const Department = require("../models/departmentModel");
const Subject = require("../models/subjectModel");
const formatResponse = require("../utils/response");
const { userStatus } = require("../utils/constants");
const { Op } = require("sequelize");

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
  const { subjectName, subjectCode, departmentId } = req.body;
  try {
    // Ensure the department exists
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res
        .status(404)
        .json(formatResponse(404, "Department not found", false));
    }

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
      departmentId,
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

const searchSubject = async (req, res) => {
  const { departmentId, status, subjectId } = req.query;
  try {
    const whereClause = {};
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
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

module.exports = {
  createDepartment,
  deleteDepartment,
  updateDepartment,
  searchDepartments,
  searchDepartmentsByRegex,
  createSubject,
  updateSubject,
  deleteSubject,
  searchSubject,
  searchSubjectsByRegx,
};
