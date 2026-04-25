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
        otp: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const { setUserInfo } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendOtp = async () => {
        setError("");
        setMessage("");

        if (!formData.email) {
            setError("Please enter email first");
            return;
        }

        try {
            await API.post("/auth/send-otp", {
                email: formData.email,
            });

            setOtpSent(true);
            setMessage("OTP sent to your email");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!formData.otp) {
            setError("Please enter OTP");
            return;
        }

        try {
            const { data } = await API.post("/auth/register", formData);

            setUserInfo(data);

            if (data.role === "patient") {
                navigate("/patient");
            } else if (data.role === "vendor") {
                navigate("/vendor");
            }
        } catch (err) {
            const backendError =
                err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.message ||
                "Registration failed";

            setError(backendError);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Register</h2>

                {error && <p className="error-text">{error}</p>}
                {message && <p className="success-text">{message}</p>}

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <button
                    type="button"
                    onClick={handleSendOtp}
                    className="btn-secondary full"
                >
                    Send OTP
                </button>

                {otpSent && (
                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                    />
                )}

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="patient">Patient</option>
                    <option value="vendor">Vendor</option>
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
                    <input
                        type="checkbox"
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                </label>

                <button type="submit" className="btn-primary full">
                    Create Account
                </button>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;