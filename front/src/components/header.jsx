import { useNavigate } from "react-router-dom";

function Header() {
    const token = localStorage.getItem("access_token");

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
        navigate("/login");
    };

    if (!token) {
        return null;
    }

    return (
        <header>
            <nav>
                <div className="nav-pages">
                    <button
                        className="nav-btn"
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>
                    <button
                        className="nav-btn"
                        onClick={() => navigate("/tasks")}
                    >
                        Tasks
                    </button>
                </div>
                <button className="perso-btn" onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    );
}

export default Header;
