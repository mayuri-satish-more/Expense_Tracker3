import SavingsGoal from "../models/SavingsGoal.js";

export const createSavingsGoal = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const {
      name,
      targetAmount,
      savedAmount = 0,
      targetDate,
      description = "",
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Goal name is required",
      });
    }

    if (
      !targetAmount ||
      Number(targetAmount) <= 0
    ) {
      return res.status(400).json({
        message:
          "Target amount must be greater than 0",
      });
    }

    if (Number(savedAmount) < 0) {
      return res.status(400).json({
        message:
          "Saved amount cannot be negative",
      });
    }

    if (
      Number(savedAmount) >
      Number(targetAmount)
    ) {
      return res.status(400).json({
        message:
          "Saved amount cannot exceed target amount",
      });
    }

    const goal =
      await SavingsGoal.create({
        userId,

        name: name.trim(),

        targetAmount:
          Number(targetAmount),

        savedAmount:
          Number(savedAmount),

        targetDate:
          targetDate || null,

        description:
          description.trim(),

        isCompleted:
          Number(savedAmount) >=
          Number(targetAmount),
      });

    res.status(201).json({
      message:
        "Savings goal created successfully",

      goal,
    });
  } catch (error) {
    console.error(
      "Create savings goal error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create savings goal",
      error: error.message,
    });
  }
};

export const getSavingsGoals = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const goals =
      await SavingsGoal.find({
        userId,
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    const formattedGoals =
      goals.map((goal) => {
        const percentage =
          goal.targetAmount > 0
            ? (goal.savedAmount /
                goal.targetAmount) *
              100
            : 0;

        return {
          ...goal.toObject(),

          progress: Math.min(
            percentage,
            100
          ),

          remainingAmount: Math.max(
            goal.targetAmount -
              goal.savedAmount,
            0
          ),
        };
      });

    res.status(200).json({
      goals: formattedGoals,
    });
  } catch (error) {
    console.error(
      "Get savings goals error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch savings goals",
      error: error.message,
    });
  }
};

export const updateSavingsGoal = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    const goal =
      await SavingsGoal.findOne({
        _id: id,
        userId,
        isActive: true,
      });

    if (!goal) {
      return res.status(404).json({
        message:
          "Savings goal not found",
      });
    }

    const {
      name,
      targetAmount,
      savedAmount,
      targetDate,
      description,
    } = req.body;

    const newTargetAmount =
      targetAmount !== undefined
        ? Number(targetAmount)
        : goal.targetAmount;

    const newSavedAmount =
      savedAmount !== undefined
        ? Number(savedAmount)
        : goal.savedAmount;

    if (
      newTargetAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Target amount must be greater than 0",
      });
    }

    if (
      newSavedAmount < 0
    ) {
      return res.status(400).json({
        message:
          "Saved amount cannot be negative",
      });
    }

    if (
      newSavedAmount >
      newTargetAmount
    ) {
      return res.status(400).json({
        message:
          "Saved amount cannot exceed target amount",
      });
    }

    if (name !== undefined) {
      goal.name = name.trim();
    }

    goal.targetAmount =
      newTargetAmount;

    goal.savedAmount =
      newSavedAmount;

    if (targetDate !== undefined) {
      goal.targetDate =
        targetDate || null;
    }

    if (description !== undefined) {
      goal.description =
        description.trim();
    }

    goal.isCompleted =
      newSavedAmount >=
      newTargetAmount;

    await goal.save();

    res.status(200).json({
      message:
        "Savings goal updated successfully",

      goal,
    });
  } catch (error) {
    console.error(
      "Update savings goal error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to update savings goal",
      error: error.message,
    });
  }
};

export const deleteSavingsGoal = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    const goal =
      await SavingsGoal.findOne({
        _id: id,
        userId,
        isActive: true,
      });

    if (!goal) {
      return res.status(404).json({
        message:
          "Savings goal not found",
      });
    }

    goal.isActive = false;

    await goal.save();

    res.status(200).json({
      message:
        "Savings goal deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete savings goal error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to delete savings goal",
      error: error.message,
    });
  }
};