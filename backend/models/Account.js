import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
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
      minlength: 2,
      maxlength: 50,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "Bank Account",
        "Credit Card",
        "Wallet",
        "Savings",
      ],
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    color: {
      type: String,
      default: "#6366f1",
    },

    icon: {
      type: String,
      default: "wallet",
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

accountSchema.index({ userId: 1, name: 1 });

const Account = mongoose.model("Account", accountSchema);

export default Account;