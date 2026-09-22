import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const TestButton = () => {
  return <button>Login</button>;
};

describe("Button Component", () => {
  test("should display Login button", () => {
    render(<TestButton />);

    const button = screen.getByRole("button", {
      name: "Login",
    });

    expect(button).toBeInTheDocument();
  });
});