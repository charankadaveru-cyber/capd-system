import Order from "../models/Order.js";

export const getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $ne: "Delivered" },
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, lat, lng, label } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status || order.status;
        order.vendor = req.user._id;

        if (lat !== undefined && lng !== undefined) {
            order.currentLocation = {
                lat,
                lng,
                label: label || status,
                updatedAt: new Date(),
            };

            order.trackingHistory.push({
                label: label || status,
                lat,
                lng,
                timestamp: new Date(),
            });
        } else {
            order.trackingHistory.push({
                label: label || status,
                lat: order.currentLocation.lat,
                lng: order.currentLocation.lng,
                timestamp: new Date(),
            });
        }

        const updatedOrder = await order.save();

        const io = req.app.get("io");
        io.emit("orderUpdated", updatedOrder);

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};