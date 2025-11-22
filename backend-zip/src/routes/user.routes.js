// routes/auth.routes.js

const express = require("express");
const authController = require("../controllers/user.controller");
const userController=require("../controllers/user.controller.js")

const router = express.Router();

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// OTP verification routes
router.post("/request-verify-otp", authController.requestVerifyOtp);
router.post("/confirm-verify-otp", authController.confirmVerifyOtp);

// Password reset via OTP
router.post("/request-reset-otp", authController.requestResetOtp);
router.post("/reset-password", authController.resetPassword);

router.get("/",userController.getAllUsers)
router.get("/profile",userController.getUserProfile)

module.exports = router;
