import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import Header from "../header";

// Mock localStorage and useNavigate
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

describe("Header Component", () => {
	it("renders navigation when token exists", () => {
		localStorage.setItem("access_token", "test-token");
		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>,
		);

		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByText("Tasks")).toBeInTheDocument();
	});

	it("does not render header when token is missing", () => {
		localStorage.removeItem("access_token");
		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>,
		);

		expect(screen.queryByRole("navigation")).toBeNull();
	});

	it("handles logout correctly", () => {
		const navigate = vi.fn();
		vi.mocked(useNavigate).mockImplementation(() => navigate);

		localStorage.setItem("access_token", "test-token");
		render(
			<BrowserRouter>
				<Header />
			</BrowserRouter>,
		);

		const logoutButton = screen.getByText("Logout");
		logoutButton.click();

		expect(localStorage.getItem("access_token")).toBeNull();
		expect(navigate).toHaveBeenCalledWith("/login");
	});
});
