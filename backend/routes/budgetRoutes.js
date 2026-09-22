import express from "express";

import {
  getBudget,
  createOrUpdateBudget,
} from "../controllers/budgetController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getBudget
);

router.post(
  "/",
  authMiddleware,
  createOrUpdateBudget
);

export default router;