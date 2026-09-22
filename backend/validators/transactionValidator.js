import { body } from "express-validator";

const transactionTypes = ["Income", "Expense"];

const recurringFrequencies = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
];

export const createTransactionValidator = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("type")
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(transactionTypes)
    .withMessage("Type must be Income or Expense"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),

  body("accountId")
    .notEmpty()
    .withMessage("Account is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Note cannot exceed 300 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date"),

  body("isRecurring")
    .optional()
    .custom((value) => {
      if (
        value !== true &&
        value !== false &&
        value !== "true" &&
        value !== "false"
      ) {
        throw new Error("Invalid recurring value");
      }

      return true;
    }),

  body("recurringFrequency")
    .optional({ values: "null" })
    .isIn(recurringFrequencies)
    .withMessage("Invalid recurring frequency"),
];

export const updateTransactionValidator = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("type")
    .optional()
    .isIn(transactionTypes)
    .withMessage("Type must be Income or Expense"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),

  body("accountId")
    .optional()
    .isMongoId()
    .withMessage("Invalid account ID"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Note cannot exceed 300 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date"),

  body("isRecurring")
    .optional()
    .custom((value) => {
      if (
        value !== true &&
        value !== false &&
        value !== "true" &&
        value !== "false"
      ) {
        throw new Error("Invalid recurring value");
      }

      return true;
    }),

  body("recurringFrequency")
    .optional({ values: "null" })
    .isIn(recurringFrequencies)
    .withMessage("Invalid recurring frequency"),

  body("removeAttachment")
    .optional()
    .isIn(["true", "false", true, false])
    .withMessage("Invalid attachment value"),
];