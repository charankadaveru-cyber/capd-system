import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import API from "../api";

function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "patient",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Firebase register
            const userCred = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Send verification email
            await sendEmailVerification(userCred.user);

            // Save in backend
            await API.post("/auth/register", formData);

            setMessage("Verification email sent. Please check your inbox.");

            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <input name="fullName" placeholder="Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <input name="password" type="password" onChange={handleChange} />

            <select name="role" onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="vendor">Vendor</option>
            </select>

            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterPage;