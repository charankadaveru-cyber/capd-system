import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">CAPD System</Link>
            <div className="nav-links">
                {!userInfo ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn-primary small">Register</Link>
                    </>
                ) : (
                    <>
                        <span className="welcome">{userInfo.fullName} ({userInfo.role})</span>
                        <button className="btn-danger small" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;