import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login";
import TasksList from "./components/tasksList";
import ProtectedRoute from "./components/protectedRoute";
import NotFound from "./components/notFound";
import TaskDetails from "./components/taskDetails";

import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                {/* Protected routes */}
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <TasksList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks/:id"
                    element={
                        <ProtectedRoute>
                            <TaskDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <NotFound />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
