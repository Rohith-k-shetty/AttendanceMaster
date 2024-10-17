const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Course extends Model {}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    courseName: {
      type: DataTypes.STRING,
      unique: true,
    },
    courseCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },

  {
    sequelize,
    modelName: "Course",
    tableName: "tblCourses",
  }
);

module.exports = Course;
