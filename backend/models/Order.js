import mongoose from "mongoose";

const trackingPointSchema = new mongoose.Schema(
    {
        label: String,
        lat: Number,
        lng: Number,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        patientName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Pending",
        },
        currentLocation: {
            lat: { type: Number, default: 17.3850 },
            lng: { type: Number, default: 78.4867 },
            label: { type: String, default: "Warehouse" },
            updatedAt: { type: Date, default: Date.now },
        },
        trackingHistory: [trackingPointSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);