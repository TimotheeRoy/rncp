import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// [{ id: 1,
// email: "nLxqG@example.com",
// first_name: "John",
// last_name: "Doe",
// is_active: true,
// is_staff: false}]

function Profile() {
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("token");
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(url + `users/${user_id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                console.error("Error fetching profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                <div>
                    <h1>Profile</h1>
                    <p>
                        Name: {profile.first_name} {profile.last_name}
                    </p>
                    <p>Email: {profile.email}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;
