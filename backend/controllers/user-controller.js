const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY;
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");
const Expense = require("../models/expense");
const DownloadedFile = require("../models/filesdownloaded");
const ForgetPasswordRequest = require("../models/forgetpasswordrequest");
// const sequelize = require("../util/database");
const S3services = require("../services/S3services");
const MailServices = require("../services/nodemailerservices");

exports.postUsers = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name, email, password);
  try {
    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } else {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res
        .status(401)
        .json({ error: "Incorrect password", success: false });
    } else {
      const token = jwt.sign(user.id, secretKey);
      return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token: token,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.forgetpassword = async (req, res, next) => {
  const email = req.body.email;
  const requestId = uuidv4();
  console.log(email);
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "Please provide the registered email!" });
  }

  const forgetpasswordrequest = new ForgetPasswordRequest({
    id: requestId,
    userId: user._id,
    isActive: true,
  });
  await forgetpasswordrequest.save();
  const info = await MailServices.forgetpasswordmail(email, requestId);
  console.log(info);
  if (info === "") {
    res.status(400).json({ message: "Unable to send mail" });
  } else {
    res.status(200).json({ message: "mail send successfully" });
  }
};

exports.download = async (req, res, next) => {
  const ispremium = req.user.ispremium;
  if (ispremium == true) {
    const expenses = await Expense.find({ userId: req.user._id });
    // const expenses = await req.user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${req.user.id}/${new Date()}.txt`;
    try {
      const fileUrl = await S3services.uploadToS3(
        stringifiedExpenses,
        filename
      );
      const filedetails = new DownloadedFile({
        location: fileUrl,
        userId: req.user._id,
      });
      await filedetails.save();
      console.log(fileUrl);
      res.status(200).json({ fileUrl, success: true });
    } catch (err) {
      res
        .status(500)
        .json({ fileUrl: "", success: "false", error: "File not created" });
    }
  } else {
    res
      .status(500)
      .json({ fileUrl: "", success: "false", error: "Unauthorized" });
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = 5; // Number of files per page
    const skip = (page - 1) * limit;

    // const files = await DownloadedFile.findAndCountAll({
    //   where: { userId: req.user.id },
    //   limit: limit,
    //   offset: offset,
    // });
    const [files, totalFiles] = await Promise.all([
      DownloadedFile.find({ userId: req.user._id }).skip(skip).limit(limit),
      DownloadedFile.countDocuments({ userId: req.user.id }),
    ]);

    console.log(files); // Contains the files for the current page
    res.status(200).json({ files, totalFiles });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
};
