import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Plus,
  TrendingUp,
  Receipt,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getDashboardData } from "../../services/dashboardService.js";

import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardData();

      setDashboard(data);
    } catch (error) {
      console.error(
        "Dashboard fetch error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (amount = 0) => {
    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />

            <div className="h-8 w-40 bg-slate-200 rounded mt-3 animate-pulse" />

            <div className="h-4 w-72 bg-slate-200 rounded mt-3 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"
            >
              <div className="w-11 h-11 bg-slate-200 rounded-xl" />

              <div className="h-4 w-28 bg-slate-200 rounded mt-5" />

              <div className="h-7 w-32 bg-slate-200 rounded mt-2" />

              <div className="h-3 w-24 bg-slate-200 rounded mt-2" />
            </div>
          ))}

        </div>

        <div className="h-80 bg-white border border-slate-200 rounded-2xl animate-pulse" />

      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-7xl mx-auto">

        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

          <Receipt
            size={40}
            className="mx-auto text-slate-400"
          />

          <h2 className="text-lg font-bold text-slate-900 mt-4">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Please try again.
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-5 inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  const {
    totalBalance = 0,
    totalIncome = 0,
    totalExpenses = 0,
    netSavings = 0,
    monthlyBudget = 0,
    remainingBudget = 0,
    budgetPercentage = 0,
  } = dashboard.summary || {};

  const recentTransactions =
    dashboard.recentTransactions || [];

  const chartData =
    dashboard.chartData || [];

  const stats = [
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      icon: Wallet,
      description: "Combined account balance",
    },
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: ArrowUpRight,
      description: "This month",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: ArrowDownRight,
      description: "This month",
    },
    {
      title: "Remaining Budget",
      value: formatCurrency(remainingBudget),
      icon: PiggyBank,
      description:
        monthlyBudget > 0
          ? "Monthly budget"
          : "Budget not set",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Heading */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            FINANCIAL OVERVIEW
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Keep track of your money and spending habits.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={fetchDashboard}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
            title="Refresh dashboard"
          >
            <RefreshCw
              size={18}
              className="text-slate-600"
            />
          </button>

          <button
            onClick={() =>
              navigate("/transactions/add")
            }
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus size={19} />
            Add Transaction
          </button>

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition"
            >

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon
                    size={21}
                    className="text-slate-700"
                  />
                </div>

              </div>

              <p className="text-sm text-slate-500 mt-5">
                {stat.title}
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1 break-words">
                {stat.value}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                {stat.description}
              </p>

            </div>
          );
        })}

      </div>

      {/* Net Savings */}

      <div className="bg-white rounded-2xl border border-slate-200 p-5">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Net Savings This Month
            </p>

            <h2
              className={`text-2xl font-bold mt-1 ${
                netSavings >= 0
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {formatCurrency(netSavings)}
            </h2>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              netSavings >= 0
                ? "bg-emerald-50"
                : "bg-red-50"
            }`}
          >
            <TrendingUp
              size={21}
              className={
                netSavings >= 0
                  ? "text-emerald-500"
                  : "text-red-500"
              }
            />
          </div>

        </div>

      </div>

      {/* Charts + Budget */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Chart */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-slate-900">
                Income vs Expenses
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your monthly financial activity
              </p>
            </div>

            <TrendingUp
              size={21}
              className="text-emerald-500"
            />

          </div>

          <div className="h-72 mt-6">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(value)
                  }
                />

                <Bar
                  dataKey="amount"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  barSize={55}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* Budget */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="font-bold text-slate-900">
                Monthly Budget
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your spending progress
              </p>
            </div>

            <PiggyBank
              size={21}
              className="text-emerald-500"
            />

          </div>

          {monthlyBudget > 0 ? (
            <div className="mt-8">

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-500">
                  Used
                </span>

                <span className="font-semibold">
                  {Math.min(
                    budgetPercentage,
                    100
                  ).toFixed(0)}
                  %
                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercentage >= 100
                      ? "bg-red-500"
                      : budgetPercentage >= 75
                      ? "bg-orange-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      budgetPercentage,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="flex justify-between mt-3">

                <span className="text-sm text-slate-500">
                  {formatCurrency(totalExpenses)} spent
                </span>

                <span className="text-sm font-semibold">
                  {formatCurrency(monthlyBudget)} budget
                </span>

              </div>

            </div>
          ) : (
            <div className="mt-8 text-center">

              <PiggyBank
                size={35}
                className="mx-auto text-slate-300"
              />

              <p className="text-sm font-medium text-slate-600 mt-3">
                No monthly budget set
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Set a budget to track your spending.
              </p>

              <button
                onClick={() => navigate("/budgets")}
                className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Set Budget
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Recent Transactions */}

      <div className="bg-white rounded-2xl border border-slate-200">

        <div className="p-6 flex items-center justify-between border-b border-slate-100">

          <div>
            <h2 className="font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your latest financial activity
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/transactions")
            }
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View all
          </button>

        </div>

        {recentTransactions.length > 0 ? (

          <div className="divide-y divide-slate-100">

            {recentTransactions.map(
              (transaction) => {

                const isIncome =
                  transaction.type === "Income";

                return (
                  <div
                    key={transaction._id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? "bg-emerald-50"
                            : "bg-red-50"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight
                            size={19}
                            className="text-emerald-500"
                          />
                        ) : (
                          <ArrowDownRight
                            size={19}
                            className="text-red-500"
                          />
                        )}
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-900 truncate">
                          {transaction.category}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {transaction.note ||
                            transaction.accountId?.name ||
                            "Transaction"}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(
                            transaction.date
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="text-right shrink-0">

                      <p
                        className={`font-bold ${
                          isIncome
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(
                          transaction.amount
                        )}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {transaction.type}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="p-10 text-center">

            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">

              <Receipt
                size={25}
                className="text-slate-400"
              />

            </div>

            <h3 className="font-semibold text-slate-900 mt-4">
              No transactions yet
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Start tracking your finances by adding your first transaction.
            </p>

            <button
              onClick={() =>
                navigate("/transactions/add")
              }
              className="mt-5 inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus size={17} />
              Add Transaction
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;