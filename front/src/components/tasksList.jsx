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
    }, [query, tasks]);

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
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="perso-btn"
                    onClick={() => navigate("/tasks/create")}
                >
                    Add Task
                </button>
            </div>
            <h2>Things to todo</h2>
            <ul>
                {tasks.not_completed ? (
                    tasks.not_completed.map((task) => (
                        <li key={task.id} className="task">
                            <input
                                type="checkbox"
                                id="uncomplete-checkbox"
                                onClick={() => toggleTaskCompletion(task.id)}
                                alt="checkbox"
                            />
                            <label for="uncomplete-checkbox">
                                {task.title}
                            </label>
                            <svg
                                width="32px"
                                height="32px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => handleTaskClick(task.id)}
                                className="edit-svg"
                            >
                                <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <path
                                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                        stroke="#FFFFFF"
                                        stroke-width="1"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path>{" "}
                                    <path
                                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                        stroke="#FFFFFF"
                                        stroke-width="1"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path>{" "}
                                </g>
                            </svg>
                        </li>
                    ))
                ) : (
                    <p>No tasks found</p>
                )}
            </ul>
            <h2>Things done</h2>
            <ul>
                {tasks.completed ? (
                    tasks.completed.map((task) => (
                        <li key={task.id}>
                            <input
                                type="checkbox"
                                id="complete-checkbox"
                                checked
                                alt="checkbox"
                                onClick={() => toggleTaskCompletion(task.id)}
                            />
                            <label for="complete-checkbox">{task.title}</label>
                            <svg
                                width="32px"
                                height="32px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => handleTaskClick(task.id)}
                                className="edit-svg"
                            >
                                <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <path
                                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                        stroke="#FFFFFF"
                                        stroke-width="1"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path>{" "}
                                    <path
                                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                        stroke="#FFFFFF"
                                        stroke-width="1"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path>{" "}
                                </g>
                            </svg>
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
