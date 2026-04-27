import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="hero-page">
            <div className="hero-card">
                <div className="hero-left">
                    <h1>CAPD Kit Delivery System</h1>
                    <p>
                        Securely manage CAPD kit requests, delivery workflows, and real-time tracking
                        for patients and vendors in one centralized platform.
                    </p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn-primary">Login</Link>
                        <Link to="/register" className="btn-secondary">Register</Link>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="info-box">
                        <h3>Features</h3>
                        <ul>
                            <li>Encrypted authentication</li>
                            <li>Role-based dashboards</li>
                            <li>Order placement</li>
                            <li>Vendor dispatch updates</li>
                            <li>Live order tracking</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;