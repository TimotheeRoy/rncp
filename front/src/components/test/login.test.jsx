import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Login from "../login";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

global.fetch = vi.fn();

describe("Login Component", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });

    it("renders input fields and buttons", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("handles successful login", async () => {
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                access: "test-access-token",
                refresh: "test-refresh-token",
                user_id: "test-user-id",
            }),
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("Login"));

        await screen.findByText("Login");

        expect(localStorage.getItem("access_token")).toBe("test-access-token");
        expect(localStorage.getItem("refresh")).toBe("test-refresh-token");
        expect(localStorage.getItem("user_id")).toBe("test-user-id");
        expect(navigate).toHaveBeenCalledWith("/tasks");
    });

    it("handles invalid credentials", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByText("Login"));

        await screen.findByText("Login");

        expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("navigates to signup on button click", () => {
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText("Sign Up"));
        expect(navigate).toHaveBeenCalledWith("/signup");
    });

    it("navigates to forgot-password on link click", () => {
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText("Forgot your password ?"));
        expect(navigate).toHaveBeenCalledWith("/forgot-password");
    });
});

