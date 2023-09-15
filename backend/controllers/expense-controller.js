const Expense = require("../models/expense");
const User = require("../models/user");

const mongoose = require("mongoose");

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.postExpenses = async (req, res, next) => {
  const expense = req.body.expense;
  const desc = req.body.desc;
  const cat = req.body.cat;
  console.log(expense, desc, cat);

  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const newExpense = await Expense.create({
      expense: expense,
      desc: desc,
      cat: cat,
      userId: req.user._id,
    });
    req.user.totalExpense += parseInt(expense);
    await req.user.save();
    console.log(newExpense);
    res.status(201).json(newExpense);
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
};

exports.getExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const expense = await Expense.findOne({
      _id: expenseId,
      userId: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const expense = await Expense.findOne({
      _id: expenseId,
      userId: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    req.user.totalExpense -= expense.expense;
    await req.user.save();
    await expense.deleteOne();
    res.status(204).json({ success: "Expense is deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
};
