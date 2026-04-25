import User from "../models/User.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

    res.json({
        totalUsers,
        totalPatients,
        totalVendors,
        totalOrders,
        pendingOrders,
        deliveredOrders,
    });
};

export const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate("patient", "fullName email phone")
        .populate("vendor", "fullName email phone")
        .sort({ createdAt: -1 });

    res.json(orders);
};

export const getAllUsers = async (req, res) => {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
};