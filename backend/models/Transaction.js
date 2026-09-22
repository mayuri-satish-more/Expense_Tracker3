import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    attachment: {
      type: String,
      default: null,
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringFrequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly", null],
      default: null,
    },

    nextOccurrence: {
      type: Date,
      default: null,
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

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, accountId: 1 });

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;