import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateProfile() {
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");
    const url = "http://localhost:8000/api/";

    const navigate = useNavigate();
    const location = useLocation();
    const profile = location.state;

    const [firstName, setFirstName] = useState(profile.first_name || "");
    const [lastName, setLastName] = useState(profile.last_name || "");

    const handleUpdate = async () => {
        try {
            const response = await fetch(url + `users/${user_id}/update/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                navigate("/profile");
            } else {
                console.error("Error updating profile");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="profile">
            <h1>Profile</h1>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label="First name"
                className="input-field"
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-label="Last name"
                className="input-field"
            />
            <button className="form-button" onClick={handleUpdate}>
                Update
            </button>
        </div>
    );
}

export default UpdateProfile;
