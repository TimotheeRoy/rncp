import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TaskUpdate from "../taskUpdate";
import React from "react";
import { BrowserRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
        useParams: () => ({ id: "1" }),
        useLocation: () => ({
            state: {
                title: "Test Task",
                description: "Test Description",
                due_date: "2023-12-31T00:00:00Z",
            },
        }),
    };
});

describe("TaskUpdate Component", () => {
    it("renders the form with pre-filled data", () => {
        render(<TaskUpdate />);

        const titleInput = screen.getByLabelText("title");
        const descriptionInput = screen.getByLabelText("description");
        const dueDateInput = screen.getByLabelText("due_date");

        expect(titleInput.value).toBe("Test Task");
        expect(descriptionInput.value).toBe("Test Description");
        expect(dueDateInput.value).toBe("2023-12-31");
    });

    it("updates form inputs correctly", () => {
        render(
            <BrowserRouter>
                <TaskUpdate />
            </BrowserRouter>
        );

        const titleInput = screen.getByLabelText("title");
        const descriptionInput = screen.getByLabelText("description");
        const dueDateInput = screen.getByLabelText("due_date");

        fireEvent.change(titleInput, { target: { value: "Updated Task" } });
        fireEvent.change(descriptionInput, {
            target: { value: "Updated Description" },
        });
        fireEvent.change(dueDateInput, { target: { value: "2024-01-01" } });

        expect(titleInput.value).toBe("Updated Task");
        expect(descriptionInput.value).toBe("Updated Description");
        expect(dueDateInput.value).toBe("2024-01-01");
    });

    it("submits the form successfully", async () => {
        const mockNavigate = vi.mocked(require("react-router-dom").useNavigate);
        const mockFetch = vi.fn(() => Promise.resolve({ ok: true }));
        global.fetch = mockFetch;

        render(
            <BrowserRouter>
                <TaskUpdate />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole("button", { name: /update/i });
        fireEvent.click(submitButton);

        expect(mockFetch).toHaveBeenCalledWith(
            "http://localhost:8000/api/tasks/1/",
            expect.objectContaining({
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer null",
                },
                body: JSON.stringify({
                    title: "Test Task",
                    description: "Test Description",
                    due_date: "2023-12-31",
                }),
            })
        );
    });
});
