const express = require("express");

const passwordController = require("../controllers/password-controller");

const router = express.Router();

// /password/resestpassword/:uuid => GET
router.get("/resestpassword/:uuid", passwordController.sendForm);

// /password/resestpassword/:uuid => POST
router.post("/resestpassword/:uuid", passwordController.updatePassword);

module.exports = router;
