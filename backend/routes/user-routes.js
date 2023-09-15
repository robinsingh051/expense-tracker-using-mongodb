const express = require("express");

const userController = require("../controllers/user-controller");
const authenticationMiddleware = require("../util/authentication");

const router = express.Router();

// /users/signUp => POST
router.post("/signUp", userController.postUsers);

// users/logIn => POST
router.post("/logIn", userController.getUser);

// users/forgetpassword => POST
router.post("/forgetpassword", userController.forgetpassword);

// users/download => GET
router.get("/download", authenticationMiddleware, userController.download);

// users/getfiles => GET
router.get("/getfiles", authenticationMiddleware, userController.getFiles);

module.exports = router;
