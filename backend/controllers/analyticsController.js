import Transaction from "../models/Transaction.js";

export const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.user._id;

    const { range = "Month" } = req.query;

    const now = new Date();

    let startDate = new Date(now);

    if (range === "Week") {
      startDate.setDate(
        now.getDate() - 7
      );
    } else if (range === "Month") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
    } else if (range === "3 Months") {
      startDate.setMonth(
        now.getMonth() - 3
      );
    } else if (range === "Year") {
      startDate = new Date(
        now.getFullYear(),
        0,
        1
      );
    }

    const transactions =
      await Transaction.find({
        userId,
        isActive: true,
        date: {
          $gte: startDate,
          $lte: now,
        },
      }).sort({
        date: 1,
      });


    const totalIncome = transactions
      .filter(
        (transaction) =>
          transaction.type === "Income"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

    

    const totalExpenses = transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

    

    const netSavings =
      totalIncome - totalExpenses;


    const categoryMap = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }

        categoryMap[transaction.category] +=
          transaction.amount;
      });

    const categoryBreakdown =
      Object.entries(categoryMap).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );


    const trendMap = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .forEach((transaction) => {
        const date = new Date(
          transaction.date
        );

        const dateKey =
          date.toISOString().split("T")[0];

        if (!trendMap[dateKey]) {
          trendMap[dateKey] = 0;
        }

        trendMap[dateKey] +=
          transaction.amount;
      });

    const spendingTrend =
      Object.entries(trendMap).map(
        ([date, amount]) => ({
          date,
          amount,
        })
      );


    const incomeExpense = [
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
      range,

      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
      },

      categoryBreakdown,

      spendingTrend,

      incomeExpense,
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch analytics data",
      error: error.message,
    });
  }
};