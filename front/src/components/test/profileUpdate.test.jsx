import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import UpdateProfile from "../profileUpdate";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
		useLocation: vi.fn(),
	};
});

global.fetch = vi.fn();

describe("UpdateProfile Component", () => {
	const mockProfileData = {
		first_name: "John",
		last_name: "Doe",
	};

	beforeEach(() => {
		vi.resetAllMocks();
		localStorage.setItem("access_token", "test-token");
		localStorage.setItem("user_id", "123");

		vi.mocked(useLocation).mockReturnValue({
			state: mockProfileData,
		});
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("renders with the initial profile data", () => {
		render(
			<BrowserRouter>
				<UpdateProfile />
			</BrowserRouter>,
		);

		expect(screen.getByPlaceholderText("First Name")).toHaveValue(
			mockProfileData.first_name,
		);
		expect(screen.getByPlaceholderText("Last Name")).toHaveValue(
			mockProfileData.last_name,
		);
	});

	it("handles input changes", async () => {
		render(
			<BrowserRouter>
				<UpdateProfile />
			</BrowserRouter>,
		);

		const firstNameInput = screen.getByPlaceholderText("First Name");
		const lastNameInput = screen.getByPlaceholderText("Last Name");

		fireEvent.change(firstNameInput, { target: { value: "Jane" } });
		fireEvent.change(lastNameInput, { target: { value: "Smith" } });

		expect(firstNameInput).toHaveValue("Jane");
		expect(lastNameInput).toHaveValue("Smith");
	});

	it("calls the update API and redirects to the profile page on success", async () => {
		const navigate = vi.fn();
		vi.mocked(useNavigate).mockImplementation(() => navigate);

		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				first_name: "Jane",
				last_name: "Smith",
			}),
		});

		render(
			<BrowserRouter>
				<UpdateProfile />
			</BrowserRouter>,
		);

		fireEvent.change(screen.getByPlaceholderText("First Name"), {
			target: { value: "Jane" },
		});
		fireEvent.change(screen.getByPlaceholderText("Last Name"), {
			target: { value: "Smith" },
		});

		fireEvent.click(screen.getByText("Update"));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users/123/update/",
				expect.objectContaining({
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer test-token",
					},
					body: JSON.stringify({
						first_name: "Jane",
						last_name: "Smith",
					}),
				}),
			);
			expect(navigate).toHaveBeenCalledWith("/profile");
		});
	});
});
