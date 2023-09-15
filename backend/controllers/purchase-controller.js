const Razorpay = require("razorpay");
const Order = require("../models/order");
const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");
const { CostExplorer } = require("aws-sdk");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatetransactionstatus = async (req, res, next) => {
  console.log(req.user.id);
  const t = await sequelize.transaction();
  try {
    const orders = await req.user.getOrders({
      where: { orderid: req.body.order_id },
    });
    const order = orders[0];
    order.paymentid = req.body.payment_id;
    order.status = "SUCCESS";
    console.log(order.id);
    await order.save({ transaction: t });
    req.user.ispremium = true;
    await req.user.save({ transaction: t });
    await t.commit();
    res.status(200).json({ message: "paymant successful" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.failedtransactionstatus = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const orders = await req.user.getOrders({
      where: { orderid: req.body.order_id },
    });
    const order = orders[0];
    order.status = "FAILED";
    await order.save({ transaction: t });
    req.user.ispremium = false;
    await req.user.save({ transaction: t });
    await t.commit();
    res.status(400).json({ message: "payment failed" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.checkPremium = async (req, res, next) => {
  if (req.user.ispremium) {
    res.status(200).json({ message: "premium user" });
  } else {
    res.status(404).json({ message: "not premium user" });
  }
};

exports.getLeaderBoard = async (req, res, next) => {
  try {
    const expenses = await User.findAll();
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
