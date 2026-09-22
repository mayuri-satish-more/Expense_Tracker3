import express from "express";

import {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createAccount);

router.get("/", getAccounts);

router.get("/:id", getAccountById);

router.put("/:id", updateAccount);

router.delete("/:id", deleteAccount);

export default router;