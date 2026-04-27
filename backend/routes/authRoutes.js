import express from "express";
import { body } from "express-validator";
import {
    registerUser,
    loginUser,
    getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/register",
    [
        body("fullName").isLength({ min: 3 }),
        body("email").isEmail(),
        body("phone").matches(/^[6-9]\d{9}$/),
        body("password").isLength({ min: 6 }),
        body("role").isIn(["patient", "vendor"]),
    ],
    registerUser
);

router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;