// src/routers/auth.routes.js
const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* ================= AUTH USER ================= */
// GET /api/auth/me
router.get("/me", authMiddleware, authController.me);

/* ================= AUTH ROUTES ================= */
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authMiddleware, authController.signout);

router.post("/verifyEmail", authController.verifyEmail);
router.post("/sendVerificationCode", authController.sendVerificationCode);

/* ================= PASSWORD ================= */
router.post("/changePassword", authMiddleware, authController.changePassword);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

module.exports = router;
