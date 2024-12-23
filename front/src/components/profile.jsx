import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// [{ id: 1,
// email: "nLxqG@example.com",
// first_name: "John",
// last_name: "Doe",
// is_active: true,
// is_staff: false}]

function Profile() {
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const deleteProfile = async () => {
        try {
            const response = await fetch(url + `users/${user_id}/delete/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user_id");
                navigate("/login");
            } else {
                console.error("Error deleting profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
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
                    <button onClick={deleteProfile}>Delete Profile</button>
                    <button
                        onClick={() =>
                            navigate("/profile/update", { state: profile })
                        }
                    >
                        Update Profile
                    </button>
                </div>
            )}
        </div>
    );
}

export default Profile;
