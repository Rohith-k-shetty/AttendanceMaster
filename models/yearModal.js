const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Year extends Model {}

Year.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["I Year", "II Year", "III Year", "IV Year", "V Year", "Passout"]],
      },
    },
  },
  {
    sequelize,
    modelName: "Year",
    tableName: "tblYears",
  }
);

module.exports = Year;
