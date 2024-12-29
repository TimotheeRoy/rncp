import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Profile from "../profile";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

global.fetch = vi.fn();

describe("Profile Component", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.setItem("access_token", "test-token");
        localStorage.setItem("user_id", "123");
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("renders the profile with fetched data", async () => {
        const mockProfileData = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProfileData,
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        screen.debug();

        expect(screen.getByText("Profile")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/John/)).toBeInTheDocument();
            expect(screen.getByText(/Doe/)).toBeInTheDocument();
            expect(
                screen.getByText(/john.doe@example.com/)
            ).toBeInTheDocument();
        });
    });

    it("handles fetch failure gracefully", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            statusText: "Not Found",
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        expect(screen.getByText("Profile")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        });
    });

    it("deletes the profile and navigates to login", async () => {
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        fetch.mockResolvedValueOnce({ ok: true });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(localStorage.getItem("access_token")).toBeNull();
            expect(navigate).toHaveBeenCalledWith("/login");
        });
    });

    it("navigates to the edit profile page with profile data", async () => {
        const mockProfileData = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
        };

        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProfileData,
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        const editButton = await screen.findByText("Edit");
        fireEvent.click(editButton);

        expect(navigate).toHaveBeenCalledWith("/profile/update", {
            state: mockProfileData,
        });
    });
});
