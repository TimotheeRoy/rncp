import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!token) {
        return null;
    }

    return (
        <header>
            <nav>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/tasks")}>Tasks</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    );
}

export default Header;
