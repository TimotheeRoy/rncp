import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { formatDate } from "../utils";

// [{ id: 1,
// title: "Task 1",
// description: "Description 1" ,
// completed: false,
// created_at: "2023-08-04T12:00:00.000Z",
// due_date: "2023-08-04T12:00:00.000Z",
// user: { id: 1, name: "User 1" }}]

function TaskDetails() {
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("access_token");

    const [taskDetails, setTaskDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasksDetails(id);
    }, []);

    const fetchTasksDetails = async (id) => {
        try {
            const response = await fetch(url + `tasks/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setTaskDetails(data);
            } else {
                console.error("Error fetching tasks:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(url + `tasks/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                navigate("/tasks");
            } else {
                console.error("Error deleting task:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h1>Task Details</h1>
            {taskDetails ? (
                <div>
                    <p>
                        <strong>Title:</strong> {taskDetails.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {taskDetails.description}
                    </p>
                    <p>
                        <strong>
                            {taskDetails.completed ? "Done" : "To do"}
                        </strong>
                    </p>
                    <p>
                        <strong>Due date:</strong>{" "}
                        {formatDate(taskDetails.due_date)}
                    </p>
                    <button onClick={() => deleteTask(taskDetails.id)}>
                        Delete Task
                    </button>
                    <button
                        onClick={() =>
                            navigate(`/tasks/${id}/update`, {
                                state: taskDetails,
                            })
                        }
                    >
                        Update Task
                    </button>
                </div>
            ) : (
                <p>No details found</p>
            )}
        </div>
    );
}

export default TaskDetails;
