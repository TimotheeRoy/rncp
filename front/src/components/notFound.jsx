import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Not Found</h1>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    );
}

export default NotFound;
