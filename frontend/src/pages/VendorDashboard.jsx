import { useEffect, useState } from "react";
import API from "../api";
import StatusBadge from "../components/StatusBadge";

function VendorDashboard() {
    const [orders, setOrders] = useState([]);
    const [trackingIntervals, setTrackingIntervals] = useState({});

    const fetchOrders = async () => {
        try {
            const { data } = await API.get("/vendor/orders");
            setOrders(data);
        } catch (error) {
            alert(error.response?.data?.message || "Cannot load orders");
        }
    };

    useEffect(() => {
        fetchOrders();

        return () => {
            Object.values(trackingIntervals).forEach((interval) =>
                clearInterval(interval)
            );
        };
    }, []);

    const sendLocationUpdate = async (id, status, label) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await API.put(`/vendor/orders/${id}/status`, {
                    status,
                    label,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });

                fetchOrders();
            },
            async () => {
                await API.put(`/vendor/orders/${id}/status`, {
                    status,
                    label,
                    lat: 17.385,
                    lng: 78.4867,
                });

                fetchOrders();
            }
        );
    };

    const updateStatus = async (id, status, label) => {
        try {
            if (status === "Accepted") {
                await API.put(`/vendor/orders/${id}/status`, {
                    status,
                    label,
                });

                fetchOrders();
            }

            if (status === "Out for Delivery") {
                await sendLocationUpdate(id, status, label);

                const interval = setInterval(() => {
                    sendLocationUpdate(id, status, "Live Location Updated");
                }, 5000);

                setTrackingIntervals((prev) => ({
                    ...prev,
                    [id]: interval,
                }));
            }

            if (status === "Delivered") {
                if (trackingIntervals[id]) {
                    clearInterval(trackingIntervals[id]);
                }

                await API.put(`/vendor/orders/${id}/status`, {
                    status,
                    label,
                });

                fetchOrders();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Status update failed");
        }
    };

    return (
        <div className="dashboard-page">
            <div className="card full-card">
                <h2>Vendor Dashboard</h2>

                {orders.length === 0 ? (
                    <p>No active orders.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-top">
                                <div>
                                    <p><strong>Order ID:</strong> #{order._id.slice(-6)}</p>
                                </div>
                                <StatusBadge status={order.status || "Pending"} />
                            </div>

                            <p>
                                <strong>Quantity:</strong> {order.quantity}
                            </p>

                            <p>
                                <strong>Address:</strong> {order.address}, {order.city} -{" "}
                                {order.pincode}
                            </p>

                            <p>
                                <strong>Current Location:</strong>{" "}
                                {order.currentLocation?.label}
                            </p>

                            <p>
                                <strong>Latitude:</strong> {order.currentLocation?.lat}
                            </p>

                            <p>
                                <strong>Longitude:</strong> {order.currentLocation?.lng}
                            </p>

                            <div className="action-group">
                                <button
                                    className="btn-secondary small"
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "Accepted",
                                            "Accepted by Vendor"
                                        )
                                    }
                                >
                                    Accept
                                </button>

                                <button
                                    className="btn-primary small"
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "Out for Delivery",
                                            "Delivery Started"
                                        )
                                    }
                                >
                                    Out for Delivery
                                </button>

                                <button
                                    className="btn-success small"
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "Delivered",
                                            "Delivered Successfully"
                                        )
                                    }
                                >
                                    Delivered
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default VendorDashboard;