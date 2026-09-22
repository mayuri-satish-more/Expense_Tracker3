import express from "express";

import {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../controllers/savingsGoalController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getSavingsGoals
);

router.post(
  "/",
  authMiddleware,
  createSavingsGoal
);

router.put(
  "/:id",
  authMiddleware,
  updateSavingsGoal
);

router.delete(
  "/:id",
  authMiddleware,
  deleteSavingsGoal
);

export default router;