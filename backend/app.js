const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");
const purchaseRoutes = require("./routes/purchase-routes");
const passwordRoutes = require("./routes/password-routes");
const authenticationMiddleware = require("./util/authentication");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/password", passwordRoutes);
app.use("/users", userRoutes);
app.use("/purchase", authenticationMiddleware, purchaseRoutes);
app.use(expenseRoutes);

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgetpasswordRequest);
// ForgetpasswordRequest.belongsTo(User);

// User.hasMany(DownloadedFile);
// DownloadedFile.belongsTo(User);

// Sync the database models
mongoose
  .connect(process.env.MONGODB)
  .then((result) => {
    console.log("Connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
