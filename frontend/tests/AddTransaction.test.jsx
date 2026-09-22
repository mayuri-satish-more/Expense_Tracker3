import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AddTransaction from "../src/pages/transactions/AddTransaction.jsx";

describe("Add Transaction Component", () => {
  test("should render Add Transaction form", () => {
    render(
      <MemoryRouter>
        <AddTransaction />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Add Transaction")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Transaction Type")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("0.00")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Add a note about this transaction..."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Save Transaction")
    ).toBeInTheDocument();
  });

  test("should switch from Expense to Income", () => {
    render(
      <MemoryRouter>
        <AddTransaction />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Food")
    ).toBeInTheDocument();

    const incomeButton = screen.getByRole(
      "button",
      {
        name: /Income Money coming in/i,
      }
    );

    fireEvent.click(incomeButton);

    expect(
      screen.getByText("Salary")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Food")
    ).not.toBeInTheDocument();
  });

  test("should show recurring frequency when enabled", () => {
    render(
      <MemoryRouter>
        <AddTransaction />
      </MemoryRouter>
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    expect(
      screen.getByText("Repeat Every")
    ).toBeInTheDocument();

    const frequencySelect =
      document.querySelector(
        'select[name="recurringFrequency"]'
      );

    expect(frequencySelect).toBeInTheDocument();

    expect(frequencySelect).toHaveValue(
      "Monthly"
    );
  });
});