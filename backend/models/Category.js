import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
      maxlength: 50,
    },

    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },
  },
  {
    timestamps: true,
  }
);

// Same user cannot create duplicate category of same type
categorySchema.index(
  { userId: 1, name: 1, type: 1 },
  { unique: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;