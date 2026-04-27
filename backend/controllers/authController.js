import { validationResult } from "express-validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// temporary OTP storage
const otpStore = new Map();

// SEND OTP
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("SEND OTP REQUEST:", email);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        console.log("Generated OTP:", otp);

        await sendEmail(
            email,
            "CAPD OTP Verification",
            `Your OTP is ${otp}`
        );

        console.log("OTP email sent successfully");

        res.json({ message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to send OTP",
        });

    }
};

// REGISTER WITH OTP
export const registerUser = async (req, res) => {
    const { fullName, email, phone, password, role, otp } = req.body;

    const savedOtp = otpStore.get(email);

    if (!savedOtp) {
        return res.status(400).json({ message: "Request OTP first" });
    }

    if (savedOtp.expiresAt < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
    }

    if (savedOtp.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.create({
        fullName,
        email,
        phone,
        password,
        role,
    });

    otpStore.delete(email);

    res.status(201).json({
        _id: user._id,
        fullName,
        email,
        role,
        token: generateToken(user._id, role),
    });
};

// LOGIN
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        _id: user._id,
        fullName: user.fullName,
        email,
        role: user.role,
        token: generateToken(user._id, user.role),
    });
};

export const getMe = async (req, res) => {
    res.json(req.user);
};