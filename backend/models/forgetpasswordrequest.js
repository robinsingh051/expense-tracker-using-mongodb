const mongoose = require("mongoose");

const forgetPasswordRequestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ForgetPasswordRequest = mongoose.model(
  "ForgetPasswordRequest",
  forgetPasswordRequestSchema
);

module.exports = ForgetPasswordRequest;

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const ForgetPasswordRequest = sequelize.define("forgetpasswordrequest", {
//   id: {
//     type: Sequelize.DataTypes.UUID,
//     defaultValue: Sequelize.DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   isactive: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: 1,
//   },
// });

// module.exports = ForgetPasswordRequest;
