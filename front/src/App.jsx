import { Routes, Route } from "react-router-dom";

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
    TaskUpdate,
    ForgotPw,
} from "./components";

import "./App.css";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPw />} />
                {/* Protected routes */}
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <TasksList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks/create"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <AddTask />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks/:id"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <TaskDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks/:id/update"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <TaskUpdate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/update"
                    element={
                        <ProtectedRoute>
                            <Header />
                            <UpdateProfile />
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
