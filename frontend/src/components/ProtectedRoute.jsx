import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
    const { userInfo } = useAuth();

    if (!userInfo) return <Navigate to="/login" />;
    if (role && userInfo.role !== role) return <Navigate to="/" />;

    return children;
}

export default ProtectedRoute;