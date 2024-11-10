import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");
    const url = "http://localhost:8000/api/";
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();


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
                console.log("Profile updated:", data);
                navigate("/profile");
            } else {
                console.error("Error updating profile");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <button onClick={handleUpdate}>Update Profile</button>
        </div>
    );
}

export default UpdateProfile;
