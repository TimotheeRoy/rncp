import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TasksList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(url + "tasks/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error("Error fetching tasks:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskClick = (id) => {
        navigate(`/tasks/${id}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Tasks</h1>
            <ul>
                {tasks ? (
                    tasks.map((task) => (
                        <li key={task.id}>
                            {task.completed ? "Done" : "To do"} - {task.title} -
                            {task.description} -{" "}
                            <button onClick={() => handleTaskClick(task.id)}>
                                Details
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No tasks found</p>
                )}
            </ul>
        </div>
    );
}

export default TasksList;
