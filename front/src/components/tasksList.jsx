import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TasksList() {
    const url = "http://localhost:8000/api/";
    const token = localStorage.getItem("access_token");

    const [tasks, setTasks] = useState({ completed: [], not_completed: [] });
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTasks(query);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const fetchTasks = async (search) => {
        try {
            const response = await fetch(
                url + "tasks/" + (search !== "" ? `?search=${search}` : ""),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTasks({
                    completed: data.completed,
                    not_completed: data.not_completed,
                });
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

    const toggleTaskCompletion = async (id) => {
        try {
            const taskToUpdate = [
                ...tasks.completed,
                ...tasks.not_completed,
            ].find((task) => task.id === id);

            if (!taskToUpdate) {
                console.error("Task not found.");
                return;
            }

            const updatedTask = {
                ...taskToUpdate,
                completed: !taskToUpdate.completed,
            };

            const response = await fetch(`${url}tasks/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: updatedTask.completed,
                }),
            });

            if (response.ok) {
                setTasks((prevTasks) => {
                    const updatedCompletedTasks = prevTasks.completed.filter(
                        (task) => task.id !== id
                    );
                    const updatedNotCompletedTasks =
                        prevTasks.not_completed.filter(
                            (task) => task.id !== id
                        );

                    if (updatedTask.completed) {
                        updatedCompletedTasks.push(updatedTask);
                    } else {
                        updatedNotCompletedTasks.push(updatedTask);
                    }

                    return {
                        completed: updatedCompletedTasks,
                        not_completed: updatedNotCompletedTasks,
                    };
                });
            } else {
                console.error("Error updating task:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div>
            <div className="search-toolbar">
                <input
                    alt="Search toolbar"
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <button onClick={() => navigate("/tasks/create")}>Add Task</button>
            <h1>Todo</h1>
            <ul>
                {tasks.not_completed ? (
                    tasks.not_completed.map((task) => (
                        <li key={task.id}>
                            {task.title} - {task.description}
                            <button
                                onClick={() => toggleTaskCompletion(task.id)}
                            >
                                Mark as Done
                            </button>
                            <button onClick={() => handleTaskClick(task.id)}>
                                Details
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No tasks found</p>
                )}
            </ul>
            <h1>Done</h1>
            <ul>
                {tasks.completed ? (
                    tasks.completed.map((task) => (
                        <li key={task.id}>
                            {task.title} - {task.description}
                            <button
                                onClick={() => toggleTaskCompletion(task.id)}
                            >
                                Mark as Todo
                            </button>
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
