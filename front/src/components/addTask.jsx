import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const navigate = useNavigate();
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(url + "tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    due_date: dueDate,
                    user: user_id,
                }),
            });
            if (response.ok) {
                navigate("/tasks");
            } else {
                console.error("Error adding task:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div>
            <h1>Add a New Task</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}

export default AddTask;
