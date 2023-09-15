const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  cat: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');

// const Expense=sequelize.define('expense',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   expense:Sequelize.STRING,
//   desc:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   cat:{
//     type:Sequelize.STRING,
//     allowNull:false
//   }
// })

// module.exports=Expense;
