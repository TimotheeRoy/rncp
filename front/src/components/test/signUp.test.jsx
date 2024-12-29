import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Signup from "../signUp";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

global.fetch = vi.fn();

describe("Signup Component", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("renders the signup form", () => {
        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    it("handles form input changes", () => {
        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "john.doe@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });

        expect(screen.getByPlaceholderText("First Name")).toHaveValue("John");
        expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Doe");
        expect(screen.getByPlaceholderText("Email")).toHaveValue(
            "john.doe@example.com"
        );
        expect(screen.getByPlaceholderText("Password")).toHaveValue(
            "password123"
        );
    });

    it("submits the form successfully and redirects to login", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "User created" }),
        });

        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "john.doe@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("SIGN UP"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/users/create/",
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: "john.doe@example.com",
                        first_name: "John",
                        last_name: "Doe",
                        password: "password123",
                    }),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("displays error message on failed registration", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Email already exists" }),
        });

        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "john.doe@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("SIGN UP"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            expect(
                screen.getByText("Email already exists")
            ).toBeInTheDocument();
        });
    });

    it("displays error message for network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "john.doe@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("SIGN UP"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            expect(
                screen.getByText("Unable to create account")
            ).toBeInTheDocument();
        });
    });
});
