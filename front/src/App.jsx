import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import {
    Login,
    TasksList,
    ProtectedRoute,
    NotFound,
    UpdateProfile,
    TaskDetails,
    AddTask,
    Header,
    Profile,
    Signup,
} from "./components";

import "./App.css";

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
                    path="/tasks/create"
                    element={
                        <ProtectedRoute>
                            <AddTask />
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
                    path="/profile/update"
                    element={
                        <ProtectedRoute>
                            <UpdateProfile />
                        </ProtectedRoute>
                    }
                />
                <Route path="/signup" element={<Signup />} />
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
