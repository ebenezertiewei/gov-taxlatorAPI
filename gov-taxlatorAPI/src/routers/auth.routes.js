// src/routers/auth.routes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

/* ================= AUTH ROUTES ================= */

// signup
router.post("/signup", authController.signup);

// send verification code
router.post("/send-code", authController.sendVerificationCode);

// verify email
router.post("/verify-email", authController.verifyEmail);

// signin
router.post("/signin", authController.signin);

// me (protected)
router.get("/me", protect, authController.me);

// change password (protected)
router.post("/change-password", protect, authController.changePassword);

// signout
router.post("/signout", authController.signout);

module.exports = router;
