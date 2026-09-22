import express from "express";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCSV,
} from "../controllers/transactionController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


import {
  createTransactionValidator,
  updateTransactionValidator,
} from "../validators/transactionValidator.js";

import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);
router.post(
  "/",
  upload.single("attachment"),
  createTransactionValidator,
  validate,
  createTransaction
);

router.get("/", getTransactions);

// CSV Export
router.get("/export", exportTransactionsCSV);

router.get("/:id", getTransactionById);

router.put(
  "/:id",
  upload.single("attachment"),
  updateTransactionValidator,
  validate,
  updateTransaction
);
router.delete("/:id", deleteTransaction);

export default router;