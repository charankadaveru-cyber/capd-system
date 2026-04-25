import express from "express";
import { body } from "express-validator";
import {
    sendOtp,
    registerUser,
    loginUser,
    getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   SEND OTP
=========================== */
router.post(
    "/send-otp",
    [
        body("email")
            .isEmail()
            .withMessage("Enter a valid email address"),
    ],
    sendOtp
);

/* ===========================
   REGISTER (WITH OTP)
=========================== */
router.post(
    "/register",
    [
        body("fullName")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Full name must be at least 3 characters"),

        body("email")
            .isEmail()
            .withMessage("Enter a valid email address"),

        body("phone")
            .matches(/^[6-9]\d{9}$/)
            .withMessage("Enter valid 10-digit phone number"),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),

        body("role")
            .isIn(["patient", "vendor"])
            .withMessage("Invalid role"),

        body("otp")
            .isLength({ min: 6, max: 6 })
            .withMessage("Enter valid 6-digit OTP"),
    ],
    registerUser
);

/* ===========================
   LOGIN
=========================== */
router.post("/login", loginUser);

/* ===========================
   GET USER PROFILE
=========================== */
router.get("/me", protect, getMe);

export default router;