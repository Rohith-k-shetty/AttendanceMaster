const { StudentBook } = require("../models/studentsBookModel");
const sequelize = require("../config/db"); 

/**
 * @param {Object} req - The request object.
 * @param {Object} res - The response object. 
 */
const insertStudentBooks = async (req, res) => {
  const studentBooks = req.body;

  // Validate input data
  if (!Array.isArray(studentBooks) || studentBooks.length === 0) {
    return res
      .status(400)
      .json({ error: "Student books should be a non-empty array" });
  }

  const transaction = await sequelize.transaction();

  try {
    // Create an array to hold the promises
    const createPromises = studentBooks.map((record) => {
      const { bookId, studentId, status } = record;

      // Validate each record
      if (!bookId || !studentId) {
        throw new Error("bookId and studentId are required for each record");
      }

      // Insert the record into the database
      return StudentBook.create(
        {
          bookId,
          studentId,
          status: status || "Active", 
        },
        { transaction }
      );
    });

    // Wait for all records to be created
    const newRecords = await Promise.all(createPromises);

    // Commit the transaction
    await transaction.commit();

    return res
      .status(201)
      .json({
        message: "Student books created successfully",
        data: newRecords,
      });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ error: "Failed to create student books" });
  }
};

module.exports = {
  insertStudentBooks,
};
