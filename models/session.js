const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "tblSessions",
    timestamps: false,
  }
);

module.exports = Session;
