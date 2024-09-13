const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Semister extends Model {}

Semister.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    semisterName: {
      type: DataTypes.STRING,
      unique: true,
    },
    semisterCode: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Semister",
    tableName: "tblSemisters",
  }
);

module.exports = Semister;
