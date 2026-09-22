import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    savedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    targetDate: {
      type: Date,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.index({
  userId: 1,
  isActive: 1,
});

const SavingsGoal = mongoose.model(
  "SavingsGoal",
  savingsGoalSchema
);

export default SavingsGoal;