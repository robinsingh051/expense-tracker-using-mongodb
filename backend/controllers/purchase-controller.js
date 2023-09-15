const Razorpay = require("razorpay");
const Order = require("../models/order");
const Expense = require("../models/expense");
const User = require("../models/user");
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
      const orderPurchase = new Order({
        orderid: order.id,
        status: "PENDING",
        userId: req.user._id,
      });
      orderPurchase.save();
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatetransactionstatus = async (req, res, next) => {
  console.log("user id", req.user._id);
  try {
    const order = await Order.findOne({ orderid: req.body.order_id });
    console.log("order", order);
    const updatedOrder = await Order.updateOne(
      { _id: order._id },
      { $set: { paymentid: req.body.payment_id, status: "SUCCESS" } }
    );
    console.log("updated order", updatedOrder);
    const updatedUser = await User.updateOne(
      { _id: req.user._id },
      { $set: { ispremium: true } }
    );
    console.log("updated user", updatedUser);
    res.status(200).json({ message: "paymant successful" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.failedtransactionstatus = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const order = Order.findOne({ orderid: req.body.order_id });
    console.log(order);
    const updatedOrder = await Order.updateOne(
      { _id: order._id },
      { $set: { status: "FAILED" } }
    );
    console.log(updatedOrder._id);
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
    const expenses = await User.find();
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
