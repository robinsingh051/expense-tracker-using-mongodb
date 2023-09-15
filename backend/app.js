const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./util/database");
const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");
const purchaseRoutes = require("./routes/purchase-routes");
const passwordRoutes = require("./routes/password-routes");
const authenticationMiddleware = require("./util/authentication");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgetpasswordRequest = require("./models/forgetpasswordrequest");
const DownloadedFile = require("./models/filesdownloaded");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "'self'",
    "https://cdnjs.cloudflare.com",
    "https://checkout.razorpay.com/v1/checkout.js",
    "'unsafe-inline'"
  );
  next();
});
app.use(express.static(path.join(__dirname, "public")));

app.use("/password", passwordRoutes);
app.use("/users", userRoutes);
app.use("/purchase", authenticationMiddleware, purchaseRoutes);
app.use(expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetpasswordRequest);
ForgetpasswordRequest.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

// Sync the database models
sequelize
  .sync()
  .then(() => {
    // Start the server
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.error(error);
  });
