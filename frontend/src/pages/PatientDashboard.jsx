import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";
import StatusBadge from "../components/StatusBadge";

const socket = io("http://localhost:5000");

function PatientDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeView, setActiveView] = useState("menu");

  const [formData, setFormData] = useState({
    quantity: "",
    address: "",
    city: "",
    pincode: "",
  });

  const fetchOrders = async () => {
    const { data } = await API.get("/patient/orders");
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => socket.off("orderUpdated");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/patient/orders", {
      ...formData,
      quantity: Number(formData.quantity),
    });

    setFormData({
      quantity: "",
      address: "",
      city: "",
      pincode: "",
    });

    fetchOrders();
    setActiveView("active");
  };

  const activeOrders = orders.filter((o) => o.status !== "Delivered");
  const historyOrders = orders.filter((o) => o.status === "Delivered");

  return (
    <div className="dashboard-page">
      <div className="patient-container">
        <h1 className="dashboard-title">Patient Dashboard</h1>

        <div className="main-menu">
          <button className="menu-card" onClick={() => setActiveView("place")}>
            <span>📦</span>
            <h3>Place Order</h3>
            <p>Request CAPD dialysis kits</p>
          </button>

          <button className="menu-card" onClick={() => setActiveView("active")}>
            <span>🚚</span>
            <h3>Active Orders</h3>
            <p>Track current deliveries</p>
          </button>

          <button className="menu-card" onClick={() => setActiveView("history")}>
            <span>📋</span>
            <h3>Order History</h3>
            <p>View completed orders</p>
          </button>
        </div>

        {activeView !== "menu" && (
          <button className="btn-secondary back-btn" onClick={() => setActiveView("menu")}>
            ← Back to Options
          </button>
        )}

        {activeView === "place" && (
          <div className="card single-section">
            <h2>Place CAPD Kit Order</h2>

            <form onSubmit={handleSubmit} className="form-grid">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                required
              />

              <button type="submit" className="btn-primary full">
                Submit Order
              </button>
            </form>
          </div>
        )}

        {activeView === "active" && (
          <div className="card single-section">
            <h2>Active Orders / Live Tracking</h2>

            {activeOrders.length === 0 ? (
              <p>No active orders.</p>
            ) : (
              activeOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-top">
                    <div>
                      <h3>Order #{order._id.slice(-6)}</h3>
                      <p className="order-id">
                        <strong>Order ID:</strong> #{order._id.slice(-6)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city} - {order.pincode}</p>
                  <p><strong>Current Location:</strong> {order.currentLocation?.label}</p>
                  <p><strong>Latitude:</strong> {order.currentLocation?.lat}</p>
                  <p><strong>Longitude:</strong> {order.currentLocation?.lng}</p>

                  <iframe
                    title={`map-${order._id}`}
                    width="100%"
                    height="250"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${order.currentLocation?.lat},${order.currentLocation?.lng}&z=15&output=embed`}
                  ></iframe>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === "history" && (
          <div className="card single-section">
            <h2>Order History</h2>

            {historyOrders.length === 0 ? (
              <p>No completed orders.</p>
            ) : (
              historyOrders.map((order) => (
                <div key={order._id} className="order-card history">
                  <div className="order-top">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <StatusBadge status={order.status} />
                  </div>

                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city} - {order.pincode}</p>
                  <p><strong>Delivered On:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;