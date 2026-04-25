import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        const { data } = await API.get("/admin/stats");
        setStats(data);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="dashboard-page">
            <h1>Admin Dashboard</h1>

            {!stats ? (
                <p>Loading...</p>
            ) : (
                <div className="stats-grid">
                    <div>Total Users: {stats.totalUsers}</div>
                    <div>Patients: {stats.totalPatients}</div>
                    <div>Vendors: {stats.totalVendors}</div>
                    <div>Total Orders: {stats.totalOrders}</div>
                    <div>Pending: {stats.pendingOrders}</div>
                    <div>Delivered: {stats.deliveredOrders}</div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;