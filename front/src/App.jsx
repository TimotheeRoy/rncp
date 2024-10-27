import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import Login from "./components/login";
import TasksList from "./components/tasksList";
import ProtectedRoute from "./components/protectedRoute";
import NotFound from "./components/notFound";
import TaskDetails from "./components/taskDetails";

import "./App.css";
import Header from "./components/header";
import Profile from "./components/profile";

function App() {
    const location = useLocation();
    const showHeader = location.pathname !== "/login";

    return (
        <div>
            {showHeader && <Header />}
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
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
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
        </div>
    );
}

export default App;
