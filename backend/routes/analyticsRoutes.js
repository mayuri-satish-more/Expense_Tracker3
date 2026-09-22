import express from "express";

import {
  getAnalyticsData,
} from "../controllers/analyticsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getAnalyticsData
);

export default router;