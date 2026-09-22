
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

const getCurrentMonthDates = () => {
  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  return {
    startDate,
    endDate,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

const getWarningLevel = (percentage) => {
  if (percentage >= 100) {
    return "Exceeded";
  }

  if (percentage >= 90) {
    return "Critical";
  }

  if (percentage >= 75) {
    return "High";
  }

  if (percentage >= 50) {
    return "Moderate";
  }

  return "Safe";
};

export const getBudget = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      startDate,
      endDate,
      month,
      year,
    } = getCurrentMonthDates();

    let budget = await Budget.findOne({
      userId,
      month,
      year,
    });

    if (!budget) {
      budget = await Budget.create({
        userId,
        month,
        year,
        overallBudget: 0,
        categoryBudgets: [],
      });
    }

    const transactions =
      await Transaction.find({
        userId,
        isActive: true,
        type: "Expense",
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      });

    const totalSpent = transactions.reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

    const overallBudget =
      budget.overallBudget || 0;

    const remainingBudget =
      overallBudget - totalSpent;

    const budgetPercentage =
      overallBudget > 0
        ? (totalSpent / overallBudget) * 100
        : 0;

    const categorySpending = {};

    transactions.forEach(
      (transaction) => {
        if (
          !categorySpending[
            transaction.category
          ]
        ) {
          categorySpending[
            transaction.category
          ] = 0;
        }

        categorySpending[
          transaction.category
        ] += transaction.amount;
      }
    );

    const categoryBudgets =
      budget.categoryBudgets.map(
        (categoryBudget) => {
          const spent =
            categorySpending[
              categoryBudget.category
            ] || 0;

          const percentage =
            categoryBudget.amount > 0
              ? (spent /
                  categoryBudget.amount) *
                100
              : 0;

          return {
            category:
              categoryBudget.category,

            budget:
              categoryBudget.amount,

            spent,

            remaining:
              categoryBudget.amount -
              spent,

            percentage,

            warning:
              getWarningLevel(
                percentage
              ),
          };
        }
      );

    res.status(200).json({
      budget: {
        id: budget._id,
        month,
        year,
        overallBudget,
        totalSpent,
        remainingBudget,
        budgetPercentage,
        warning:
          getWarningLevel(
            budgetPercentage
          ),
        categoryBudgets,
      },
    });
  } catch (error) {
    console.error(
      "Get budget error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch budget",
      error: error.message,
    });
  }
};

export const createOrUpdateBudget =
  async (req, res) => {
    try {
      const userId = req.user._id;

      const {
        overallBudget = 0,
        categoryBudgets = [],
      } = req.body;

      if (
        Number(overallBudget) < 0
      ) {
        return res.status(400).json({
          message:
            "Overall budget cannot be negative",
        });
      }

      if (
        !Array.isArray(
          categoryBudgets
        )
      ) {
        return res.status(400).json({
          message:
            "Category budgets must be an array",
        });
      }

      for (const item of categoryBudgets) {
        if (
          !item.category ||
          Number(item.amount) < 0
        ) {
          return res.status(400).json({
            message:
              "Invalid category budget",
          });
        }
      }

      const {
        month,
        year,
      } = getCurrentMonthDates();

      const budget =
        await Budget.findOneAndUpdate(
          {
            userId,
            month,
            year,
          },
          {
            userId,
            month,
            year,
            overallBudget:
              Number(overallBudget),

            categoryBudgets:
              categoryBudgets.map(
                (item) => ({
                  category:
                    item.category.trim(),

                  amount:
                    Number(item.amount),
                })
              ),
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.status(200).json({
        message:
          "Budget saved successfully",

        budget,
      });
    } catch (error) {
      console.error(
        "Save budget error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to save budget",
        error: error.message,
      });
    }
  };