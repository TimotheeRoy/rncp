import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
    const url = "http://localhost:8000/api/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(url + "login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh", data.refresh);
                localStorage.setItem("user_id", data.user_id);
                navigate("/tasks");
            } else if (response.status === 401) {
                localStorage.removeItem("access_token");
                console.error("Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <input
                aria-label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field"
            />
            <input
                aria-label="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
            />
            <div>
                <button type="submit" className="form-button">
                    Login
                </button>
                <p
                    className="forgot-pw"
                    onClick={() => navigate("/forgot-password")}
                >
                    Forgot your password ?
                </p>
            </div>
            <button className="form-button" onClick={() => navigate("/signup")}>
                Sign Up
            </button>
        </form>
    );
}

export default Login;
