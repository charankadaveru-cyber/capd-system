import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
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
            const { data } = await API.post("/auth/login", formData);
            setUserInfo(data);
            if (data.role === "patient") navigate("/patient");
            else navigate("/vendor");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error-text">{error}</p>}
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
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
                <button type="submit" className="btn-primary full">Login</button>
                <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );
}

export default LoginPage;