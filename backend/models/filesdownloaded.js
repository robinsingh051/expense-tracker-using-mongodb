const mongoose = require("mongoose");

const downloadedfileSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const downloadedfile = mongoose.model("downloadedfile", downloadedfileSchema);

module.exports = downloadedfile;

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const downloadedfile = sequelize.define("downloadedfile", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   location: Sequelize.STRING,
// });

// module.exports = downloadedfile;
