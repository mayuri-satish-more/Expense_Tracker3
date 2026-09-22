import express from "express";

import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCategories);

router.post("/", authMiddleware, createCategory);

router.delete("/:id", authMiddleware, deleteCategory);

export default router;