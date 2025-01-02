import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { BrowserRouter, useNavigate, useParams } from "react-router-dom";
import { vi } from "vitest";
import TaskDetails from "../taskDetails";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
		useParams: vi.fn(),
	};
});

global.fetch = vi.fn();

describe("TaskDetails Component", () => {
	const mockNavigate = vi.fn();
	const mockUseParams = { id: "1" };
	const taskDetailsMock = {
		id: 1,
		title: "Test Task",
		description: "This is a test task",
		due_date: "2024-12-31",
		completed: false,
	};

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
		vi.mocked(useParams).mockImplementation(() => mockUseParams);
		localStorage.setItem("access_token", "mock-token");
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("renders the task details and loading state", async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => taskDetailsMock,
		});

		render(
			<BrowserRouter>
				<TaskDetails />
			</BrowserRouter>,
		);
		expect(screen.getByText("Loading...")).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText(/test task/)).toBeInTheDocument();
			expect(screen.getByText(/This is a test task/)).toBeInTheDocument();
			expect(screen.getByText(/31\/12\/2024/)).toBeInTheDocument();
		});
	});
});
