import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import AddTask from "../taskCreate";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

global.fetch = vi.fn();

describe("AddTask Component", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
        localStorage.setItem("access_token", "mock-token");
        localStorage.setItem("user_id", "1");
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("renders the form with all fields", () => {
        render(
            <BrowserRouter>
                <AddTask />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
        expect(screen.getByLabelText("due-date")).toBeInTheDocument();
    });

    it("updates the state when input values change", () => {
        render(
            <BrowserRouter>
                <AddTask />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Title"), {
            target: { value: "Test Task" },
        });
        fireEvent.change(screen.getByPlaceholderText("Description"), {
            target: { value: "Task description" },
        });
        fireEvent.change(screen.getByLabelText("due-date"), {
            target: { value: "2024-12-31" },
        });

        expect(screen.getByPlaceholderText("Title")).toHaveValue("Test Task");
        expect(screen.getByPlaceholderText("Description")).toHaveValue(
            "Task description"
        );
        expect(screen.getByLabelText("due-date")).toHaveValue("2024-12-31");
    });

    it("submits the form and navigates to /tasks on success", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "Task added successfully" }),
        });

        render(
            <BrowserRouter>
                <AddTask />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Title"), {
            target: { value: "Test Task" },
        });
        fireEvent.change(screen.getByPlaceholderText("Description"), {
            target: { value: "Task description" },
        });
        fireEvent.change(screen.getByLabelText("due-date"), {
            target: { value: "2024-12-31" },
        });

        fireEvent.click(screen.getByText("Add Task"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/tasks/",
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer mock-token`,
                    },
                    body: JSON.stringify({
                        title: "Test Task",
                        description: "Task description",
                        due_date: "2024-12-31",
                        user: "1",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/tasks");
        });
    });
});
