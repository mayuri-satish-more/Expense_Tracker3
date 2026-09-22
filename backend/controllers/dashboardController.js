import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Current month dates
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // Get user's active accounts
    const accounts = await Account.find({
      userId,
      isActive: true,
    });

    // Combined balance
    const totalBalance = accounts.reduce(
      (total, account) => total + account.balance,
      0
    );

    // Current month transactions
    const monthlyTransactions =
      await Transaction.find({
        userId,
        isActive: true,
        date: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

    // Monthly income
    const totalIncome = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "Income"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

    // Monthly expenses
    const totalExpenses = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

    // Remaining balance for current month
    const netSavings =
      totalIncome - totalExpenses;

    // Recent transactions
    const recentTransactions =
      await Transaction.find({
        userId,
        isActive: true,
      })
        .populate(
          "accountId",
          "name type balance"
        )
        .sort({
          date: -1,
          createdAt: -1,
        })
        .limit(10);

    // Income vs Expense chart
    const chartData = [
      {
        name: "Income",
        amount: totalIncome,
      },
      {
        name: "Expense",
        amount: totalExpenses,
      },
    ];

    res.status(200).json({
      summary: {
        totalBalance,
        totalIncome,
        totalExpenses,
        netSavings,
        monthlyBudget: 0,
        remainingBudget: 0,
        budgetPercentage: 0,
      },

      chartData,

      recentTransactions,

      accounts,
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};