import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPw from "../forgotPw";

describe("ForgotPw Component", () => {
    it("renders the form correctly", () => {
        render(<ForgotPw />);

        expect(screen.getByText(/Forgot your password/i)).toBeInTheDocument();

        const emailInput = screen.getByPlaceholderText(/Email/i);
        expect(emailInput).toBeInTheDocument();

        const submitButton = screen.getByRole("button", { name: /Send/i });
        expect(submitButton).toBeInTheDocument();
    });

    it("updates the email state on input change", () => {
        render(<ForgotPw />);
        const emailInput = screen.getByPlaceholderText(/Email/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        expect(emailInput.value).toBe("test@example.com");
    });

    it("submits the form when the button is clicked", () => {
        render(<ForgotPw />);
        const emailInput = screen.getByPlaceholderText(/Email/i);
        const submitButton = screen.getByRole("button", { name: /Send/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);
    });
});
