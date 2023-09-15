const express = require("express");

const purchaseController = require("../controllers/purchase-controller");

const router = express.Router();

// /purchase/premiummembership => POST
router.get("/premiummembership", purchaseController.purchasePremium);

// purchase/updatetransactionstatus => POST
router.post(
  "/updatetransactionstatus",
  purchaseController.updatetransactionstatus
);

// purchase/failedtransactionstatus => POST
router.post(
  "/failedtransactionstatus",
  purchaseController.failedtransactionstatus
);

// /purchase/checkpremium => GET
router.get("/checkpremium", purchaseController.checkPremium);

// /purchase/getleaderboard =>
router.get("/getleaderboard", purchaseController.getLeaderBoard);

module.exports = router;
