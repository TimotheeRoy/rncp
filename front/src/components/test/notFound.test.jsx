import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import NotFound from "../notFound";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe("NotFound Component", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("renders the Not Found message", () => {
        render(
            <BrowserRouter>
                <NotFound />
            </BrowserRouter>
        );

        expect(screen.getByText("Not Found")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("navigates to the login page when the button is clicked", () => {
        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        render(
            <BrowserRouter>
                <NotFound />
            </BrowserRouter>
        );

        const button = screen.getByText("Login");
        fireEvent.click(button);

        expect(navigate).toHaveBeenCalledWith("/login");
    });
});

