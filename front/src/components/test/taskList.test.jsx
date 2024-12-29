import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TasksList from "../tasksList";
import { BrowserRouter } from "react-router-dom";

test("renders search toolbar and headings", () => {
    render(
        <BrowserRouter>
            <TasksList />
        </BrowserRouter>
    );

    waitFor(() => {
        expect(screen.getByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
        expect(screen.getByText("Things to todo")).toBeInTheDocument();
        expect(screen.getByText("Things done")).toBeInTheDocument();
    });
});

test("displays loading message initially", () => {
    render(
        <BrowserRouter>
            <TasksList />
        </BrowserRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                completed: [{ id: 1, title: "Completed Task" }],
                not_completed: [{ id: 2, title: "Not Completed Task" }],
            }),
    })
);

test("fetches and displays tasks correctly", async () => {
    render(
        <BrowserRouter>
            <TasksList />
        </BrowserRouter>
    );

    waitFor(() => {
        expect(screen.getByText("Completed Task")).toBeInTheDocument();
        expect(screen.getByText("Not Completed Task")).toBeInTheDocument();
    });
});

global.fetch = vi.fn();

test("search updates displayed tasks", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
            Promise.resolve({
                completed: [],
                not_completed: [{ id: 3, title: "Searched Task" }],
            }),
    });

    render(
        <BrowserRouter>
            <TasksList />
        </BrowserRouter>
    );

    waitFor(() => {
        const searchInput = screen.getByPlaceholderText("Search");
        searchInput.value = "Searched";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));

        expect(screen.getByText("Searched Task")).toBeInTheDocument();
    });
});

test("toggles task completion correctly", async () => {
    fetch.mockImplementation((url, options) => {
        if (options.method === "PUT") {
            return Promise.resolve({ ok: true });
        }
        return Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    completed: [],
                    not_completed: [{ id: 2, title: "Task to Toggle" }],
                }),
        });
    });

    render(
        <BrowserRouter>
            <TasksList />
        </BrowserRouter>
    );

    waitFor(() => {
        const checkbox = screen.getByAltText("checkbox");

        checkbox.click();

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("tasks/2/"),
            expect.objectContaining({ method: "PUT" })
        );
    });
});
