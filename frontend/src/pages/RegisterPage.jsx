import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "patient",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { setUserInfo } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const { data } = await API.post("/auth/register", formData);
            setUserInfo(data);
            if (data.role === "patient") navigate("/patient");
            else navigate("/vendor");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p className="error-text">{error}</p>}
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="patient">Patient</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                </select>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label className="checkbox-line">
                    <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Show Password
                </label>
                <button type="submit" className="btn-primary full">Create Account</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default RegisterPage;