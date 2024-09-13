const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");
const AttendenceBook = require("./bookModel");

class StudentBook extends Model {}

StudentBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: AttendenceBook,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },
  {
    sequelize,
    modelName: "StudentBook",
    tableName: "tblStudentBook",
  }
);

module.exports = StudentBook;
