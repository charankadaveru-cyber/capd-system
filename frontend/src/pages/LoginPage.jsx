import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import API from "../api";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCred = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // check verification
            if (!userCred.user.emailVerified) {
                setError("Please verify your email first");
                return;
            }

            const { data } = await API.post("/auth/login", formData);

            if (data.role === "patient") navigate("/patient");
            else navigate("/vendor");

        } catch (err) {
            setError("Invalid login");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            {error && <p>{error}</p>}

            <input name="email" onChange={handleChange} />
            <input name="password" type="password" onChange={handleChange} />

            <button type="submit">Login</button>
        </form>
    );
}

export default LoginPage;