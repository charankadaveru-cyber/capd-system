import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const registerUser = async (req, res) => {
    const { fullName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
        fullName,
        email,
        phone,
        password,
        role,
    });

    res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
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
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    });
};

// PROFILE
export const getMe = async (req, res) => {
    res.json(req.user);
};