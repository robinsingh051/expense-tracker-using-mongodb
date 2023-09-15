const path = require("path");
const express = require("express");

const expenseController = require("../controllers/expense-controller");
const authenticationMiddleware = require("../util/authentication");

const router = express.Router();

// /expenses => GET
router.get(
  "/expenses",
  authenticationMiddleware,
  expenseController.getExpenses
);

// /expenses => POST
router.post(
  "/expenses",
  authenticationMiddleware,
  expenseController.postExpenses
);

// /expense/:id => GET
router.get(
  "/expense/:id",
  authenticationMiddleware,
  expenseController.getExpense
);

// /expense/:id => DELETE
router.delete(
  "/expense/:id",
  authenticationMiddleware,
  expenseController.deleteExpense
);

// any route
router.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, "../public/${req.url}"));
});

module.exports = router;
