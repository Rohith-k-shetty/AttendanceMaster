const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Subject extends Model {}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    subjectName: {
      type: DataTypes.STRING,
      unique: true,
    },
    subjectCode: {
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
    modelName: "Subject",
    tableName: "tblSubjects",
  }
);

module.exports = Subject;
