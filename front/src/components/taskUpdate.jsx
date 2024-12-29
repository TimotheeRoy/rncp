import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function TaskUpdate() {
    const location = useLocation();
    const task = location.state;
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(
        task.due_date ? task.due_date.split("T")[0] : ""
    );
    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem("access_token");
    const url = "http://localhost:8000/api/";

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(url + `tasks/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    due_date: dueDate,
                }),
            });
            if (response.ok) {
                navigate("/tasks");
            } else {
                console.error("Error updating profile");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <form className="profile" onSubmit={handleUpdate}>
            <h1>Update Task</h1>
            <input
                type="text"
                placeholder={task.title}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="title"
                className="input-field"
            />
            <textarea
                placeholder={task.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-label="description"
                className="input-field"
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="due_date"
                className="input-field"
            />
            <button className="form-button" type="submit">
                Update
            </button>
        </form>
    );
}

export default TaskUpdate;
