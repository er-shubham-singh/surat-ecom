// routes/auth.routes.js
import express from "express";
import * as authController from "../controller/user.contoller.js";

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

export default router;
