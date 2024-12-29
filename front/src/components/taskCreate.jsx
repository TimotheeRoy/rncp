import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const navigate = useNavigate();

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
        <form className="profile" onSubmit={handleSubmit}>
            <h1>New Task</h1>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-label="title"
                className="input-field"
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                aria-label="description"
                className="input-field"
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                aria-label="due-date"
                className="input-field"
            />
            <button className="form-button" type="submit">
                Add Task
            </button>
        </form>
    );
}

export default AddTask;
