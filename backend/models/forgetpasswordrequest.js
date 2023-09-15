const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgetPasswordRequest = sequelize.define("forgetpasswordrequest", {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    primaryKey: true,
  },
  isactive: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
  },
});

module.exports = ForgetPasswordRequest;
