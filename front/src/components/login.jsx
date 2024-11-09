import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const url = "http://localhost:8000/api/";

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
            console.log(response);
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
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button type="submit">Login</button>
            <label>
                Don't have an account ?
                <button onClick={() => navigate("/signup")}>Sign Up</button>
            </label>
        </form>
    );
}

export default Login;
