const Book = require("../models/bookModel");
const { generateUserId } = require("../utils/functions");

const createBook = async (req, res) => {
  const {
    bookName,
    bookCode,
    status,
    departmentId,
    semisterId,
    subjectId,
    teacherId,
  } = req.body;
  try {
    const existingBook = await Book.findOne({
      where: {
        bookCode: bookCode.toUpperCase(),
      },
    });

    if (existingBook) {
      console.log(`Subject with subjectCode ${bookCode} already exists.`);
      return res.status(400).json({
        error: `Subject with subjectCode ${bookCode} already exists.`,
      });
    }

    var Bookid = await generateUserId();
    const newBook = await Book.create({
      id: Bookid,
      bookCode: bookCode.toUpperCase(),
      status: status,
      bookName: bookName,
      departmentId: departmentId,
      semisterId: semisterId,
      subjectId: subjectId,
      teacherId: teacherId,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject." });
  }
};

module.exports = { createBook };
