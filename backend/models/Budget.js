import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    overallBudget: {
      type: Number,
      default: 0,
      min: 0,
    },

    categoryBudgets: [
      {
        category: {
          type: String,
          required: true,
          trim: true,
        },

        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

budgetSchema.index(
  {
    userId: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

const Budget = mongoose.model(
  "Budget",
  budgetSchema
);

export default Budget;