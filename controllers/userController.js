const sequelize = require("../config/db");
const { Op } = require("sequelize");
const User = require("../models/user");
const { hashPassword } = require("../utils/functions");
const { userStatus } = require("../utils/constants");
const formatResponse = require("../utils/response");

// Function to create a user from user routes
const createUser = async (req, res) => {
  try {
    // Extract user details from the request body
    const {
      name,
      username,
      role,
      departmentId,
      email,
      PhotoUrl,
      phoneNo,
      yearId,
      parentPhone,
    } = req.body;

    // Validate required fields
    if (!name || !username || !role || !yearId) {
      return res
        .status(400)
        .json(
          formatResponse(400, "Name, username, year and role  are required", false)
        );
    }

    const hashedPassword = await hashPassword("Welcome@123");

    // Create a new user in the database
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      role,
      status: userStatus[0],
      departmentId: departmentId || null,
      email: email || null,
      PhotoUrl: PhotoUrl || null,
      phoneNo: phoneNo || null,
      yearId: yearId || null,
      parentPhone: parentPhone || null,
    });

    return res
      .status(201)
      .json(formatResponse(201, "User created successfully", true, newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to create user", false, {
        error: error.message,
      })
    );
  }
};

//bulk update for users
const bulkCreateUsers = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Extract users from req.body
    const users = req.body;

    // Extract all usernames from the incoming request
    const usernames = users.map((user) => user.username);

    // Check for duplicate usernames within the provided Excel data (req.body)
    const duplicateUsernames = usernames.filter(
      (username, index, arr) => arr.indexOf(username) !== index
    );

    // If there are duplicates within the incoming request, return an error
    if (duplicateUsernames.length > 0) {
      return res.status(400).json(
        formatResponse(
          400,
          "Duplicate usernames found in the provided data",
          false,
          {
            duplicates: [...new Set(duplicateUsernames)], // Return only unique duplicate usernames
          }
        )
      );
    }

    // Hash the password once
    const hashedPassword = await hashPassword("Welcome@123");

    // Fetch existing usernames in the database
    const existingUsers = await User.findAll({
      where: {
        username: {
          [Op.in]: usernames,
        },
      },
      attributes: ["username"],
    });

    // Convert existing usernames to a Set for easy lookup
    const existingUsernames = new Set(
      existingUsers.map((user) => user.username)
    );

    // Filter out users that already exist in the database
    const newUsers = users
      .filter((user) => !existingUsernames.has(user.username))
      .map((user) => ({
        ...user,
        password: hashedPassword,
        status: "Active",
        departmentId: user.departmentId || null,
        email: user.email || null,
        PhotoUrl: user.PhotoUrl || null,
        phoneNo: user.phoneNo || null,
        yearId: user.yearId || null,
        parentPhone: user.parentPhone || null,
      }));

    // Check if there are any new users to insert
    if (newUsers.length === 0) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "No new users to insert. All users already exist.",
            false
          )
        );
    }

    // Batch process the insertion in parallel
    const batchSize = 1000;
    const batchPromises = [];

    for (let i = 0; i < newUsers.length; i += batchSize) {
      const batch = newUsers.slice(i, i + batchSize);
      batchPromises.push(User.bulkCreate(batch, { transaction }));
    }

    // Execute all batch insertions in parallel
    await Promise.all(batchPromises);

    // Commit the transaction
    await transaction.commit();

    console.log(`${newUsers.length} users inserted successfully.`);

    // Return a success response
    return res
      .status(201)
      .json(
        formatResponse(
          201,
          `${newUsers.length} users created successfully`,
          true
        )
      );
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    console.error("Error inserting users:", error);

    // Return an error response
    return res.status(500).json(
      formatResponse(500, "Failed to create users", false, {
        error: error.message,
      })
    );
  }
};

// Function to reset user password
const resetUserPassword = async (userId, newPassword) => {
  try {
    // Validate inputs
    if (!userId || !newPassword) {
      return formatResponse(
        400,
        "User ID and new password are required.",
        false
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password for the user with the specified userId
    const [affectedRows] = await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    if (affectedRows === 0) {
      return formatResponse(404, "User not found.", false);
    }

    return formatResponse(200, "Password updated successfully.", true);
  } catch (error) {
    console.error("Error resetting user password:", error);
    return formatResponse(500, "Failed to reset password.", false, {
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params; // User ID from URL parameters
  const updates = req.body; // Fields to update from request body

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "User ID is required", false));
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json(formatResponse(404, "User not found", false));
    }

    // Update only the fields that are provided in the request body
    await user.update(updates);

    // Return a success response
    return res
      .status(200)
      .json(formatResponse(200, "User updated successfully", true, user));
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to update user", false, {
        error: error.message,
      })
    );
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "User ID is required", false));
  }
  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(formatResponse(404, "User not found", false));
    }
    // Update the status to "Inactive" (or any status from userStatus[1])
    user.status = userStatus[1];
    await user.save();
    // Return a success response
    return res
      .status(200)
      .json(
        formatResponse(200, "User marked as deleted successfully", true, user)
      );
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to delete user", false, {
        error: error.message,
      })
    );
  }
};

const activateUser = async (req, res) => {
  const { id } = req.params; // User ID from URL parameters

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "User ID is required", false));
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json(formatResponse(404, "User not found", false));
    }
    user.status = userStatus[0];
    await user.save();

    // Return a success response
    return res
      .status(200)
      .json(
        formatResponse(200, "User marked as deleted successfully", true, user)
      );
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to Activate user", false, {
        error: error.message,
      })
    );
  }
};

//request to get a single user
const getUser = async (req, res) => {
  const { id } = req.params; // User ID from URL parameters

  if (!id) {
    return res
      .status(400)
      .json(formatResponse(400, "User ID is required", false));
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json(formatResponse(404, "User not found", false));
    }
    // Return a success response
    return res
      .status(200)
      .json(
        formatResponse(200, "User marked as deleted successfully", true, user)
      );
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to get user data", false, {
        error: error.message,
      })
    );
  }
};

// Controller for searching by optional username, phone, or name
const getByNameOrPhone = async (req, res) => {
  try {
    const { departmentId, searchTerm } = req.query; // extract departmentId and searchTerm from query params

    // Construct the where condition dynamically based on the presence of departmentId and search term
    const whereCondition = {};

    if (departmentId) {
      whereCondition.departmentId = parseInt(departmentId); // Ensure departmentId is an integer
    }

    if (searchTerm) {
      // Use Op.or to search across username, phoneNo, and name
      whereCondition[Op.or] = [
        { username: { [Op.iLike]: `%${searchTerm}%` } }, // Case-insensitive match for username
        { phoneNo: { [Op.iLike]: `%${searchTerm}%` } }, // Case-insensitive match for phone number
        { name: { [Op.iLike]: `%${searchTerm}%` } }, // Case-insensitive match for name
      ];
    }

    // Fetch users based on the dynamic where condition
    const users = await User.findAll({
      where: whereCondition,
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json(
          formatResponse(
            404,
            "No users found matching the search criteria.",
            false
          )
        );
    }

    return res
      .status(200)
      .json(formatResponse(200, "Users retrieved successfully", true, users));
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to search users", false, {
        error: error.message,
      })
    );
  }
};

const searchUsersBySingleFields = async (req, res) => {
  const { departmentId, yearId, status, role } = req.query;
  try {
    // Build the where clause dynamically
    const whereClause = {};
    if (departmentId && departmentId !== "all")
      whereClause.departmentId = parseInt(departmentId);
    if (yearId && yearId !== "all") whereClause.yearId = parseInt(yearId);
    if (status && status !== "all") whereClause.status = status;
    if (role && role !== "all") whereClause.role = role;
    // Fetch users based on the dynamic where clause
    const users = await User.findAll({
      where: whereClause,
    });

    if (users.length === 0) {
      return res.status(404).json(formatResponse(404, "No users found", false));
    }

    return res
      .status(200)
      .json(formatResponse(200, "Users retrieved successfully", true, users));
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to retrieve users", false, {
        error: error.message,
      })
    );
  }
};

const searchUsersByArrayFields = async (req, res) => {
  const { departmentIds, yearId, statuses } = req.query;

  try {
    // Build the where clause dynamically
    const whereClause = {};

    if (departmentIds) {
      // Split the departmentIds string into an array and parse each one as integer
      const departmentIdArray = departmentIds
        .split(",")
        .map((id) => parseInt(id));
      whereClause.departmentId = { [Op.in]: departmentIdArray };
    }

    if (yearId) whereClause.yearId = parseInt(yearId);

    if (statuses) {
      // Split the statuses string into an array
      const statusArray = statuses.split(",");
      whereClause.status = { [Op.in]: statusArray };
    }

    // Fetch users based on the dynamic where clause
    const users = await User.findAll({
      where: whereClause,
    });

    if (users.length === 0) {
      return res.status(404).json(formatResponse(404, "No users found", false));
    }

    return res
      .status(200)
      .json(formatResponse(200, "Users retrieved successfully", true, users));
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json(
      formatResponse(500, "Failed to retrieve users", false, {
        error: error.message,
      })
    );
  }
};

module.exports = {
  createUser,
  bulkCreateUsers,
  resetUserPassword,
  updateUser,
  deleteUser,
  activateUser,
  getUser,
  getByNameOrPhone,
  searchUsersBySingleFields,
  searchUsersByArrayFields,
};
