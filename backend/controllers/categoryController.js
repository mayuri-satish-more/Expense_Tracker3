import Category from "../models/Category.js";

// Create custom category
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Category name and type are required",
      });
    }

    if (!["Income", "Expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be Income or Expense",
      });
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({
        message: "Category name cannot be empty",
      });
    }

    const existingCategory = await Category.findOne({
      userId: req.user._id,
      name: trimmedName,
      type,
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      userId: req.user._id,
      name: trimmedName,
      type,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      message: "Server error while creating category",
    });
  }
};


// Get user's custom categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      userId: req.user._id,
    }).sort({
      type: 1,
      name: 1,
    });

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Server error while fetching categories",
    });
  }
};


// Delete custom category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Server error while deleting category",
    });
  }
};