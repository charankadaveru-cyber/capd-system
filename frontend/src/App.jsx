import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import VendorDashboard from "./pages/VendorDashboard";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/vendor"
                    element={
                        <ProtectedRoute role="vendor">
                            <VendorDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;