import { Route, Routes } from "react-router-dom";

import {
	AddTask,
	ForgotPw,
	Header,
	Login,
	NotFound,
	Profile,
	ProtectedRoute,
	Signup,
	TaskDetails,
	TaskUpdate,
	TasksList,
	UpdateProfile,
} from "./components";

import "./App.css";

function App() {
	return (
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
	);
}

export default App;
