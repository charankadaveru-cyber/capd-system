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

// SEND OTP
router.post(
    "/send-otp",
    [body("email").isEmail().withMessage("Enter valid email")],
    sendOtp
);

// REGISTER
router.post(
    "/register",
    [
        body("fullName").isLength({ min: 3 }),
        body("email").isEmail(),
        body("phone").matches(/^[6-9]\d{9}$/),
        body("password").isLength({ min: 6 }),
        body("role").isIn(["patient", "vendor"]),
        body("otp").isLength({ min: 6, max: 6 }),
    ],
    registerUser
);

// LOGIN
router.post("/login", loginUser);

// PROFILE
router.get("/me", protect, getMe);

export default router;