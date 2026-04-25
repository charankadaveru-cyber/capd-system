import express from "express";
import { body } from "express-validator";
import { getMe, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/register",
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("Valid email required"),
        body("phone").isLength({ min: 10 }).withMessage("Phone required"),
        body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
        body("role").isIn(["patient", "vendor", "admin"]).withMessage("Invalid role"),
    ],
    registerUser
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("password").notEmpty().withMessage("Password required"),
    ],
    loginUser
);

router.get("/me", protect, getMe);

export default router;