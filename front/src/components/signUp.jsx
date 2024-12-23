import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const url = "http://localhost:8000/api/";

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(url + "users/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Account creation successful, redirect to login page
                navigate("/login");
            } else {
                const data = await response.json();
                setError(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Unable to create account");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    alt="First Name"
                    placeholder="First Name"
                    className="input-field"
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    alt="Last Name"
                    placeholder="Last Name"
                    className="input-field"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    alt="Email"
                    placeholder="Email"
                    className="input-field"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    alt="Password"
                    placeholder="Password"
                    className="input-field"
                />

                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" className="form-button">
                    SIGN UP
                </button>
            </form>
        </div>
    );
}

export default Signup;
