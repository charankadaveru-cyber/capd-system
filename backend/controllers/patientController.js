import { validationResult } from "express-validator";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { quantity, address, city, pincode } = req.body;

    const order = await Order.create({
        patient: req.user._id,
        patientName: req.user.fullName,
        quantity,
        address,
        city,
        pincode,
        trackingHistory: [
            {
                label: "Order Placed",
                lat: 17.3850,
                lng: 78.4867,
            },
        ],
    });

    res.status(201).json(order);
};

export const getPatientOrders = async (req, res) => {
    const orders = await Order.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};