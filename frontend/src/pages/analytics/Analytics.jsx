import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAnalyticsData } from "../../services/analyticsService.js";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
};

const Analytics = () => {
  const [range, setRange] =
    useState("Month");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchAnalytics = async (
    selectedRange = range
  ) => {
    try {
      setRefreshing(true);

      const data =
        await getAnalyticsData(
          selectedRange
        );

      setAnalytics(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-200" />

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  const summary =
    analytics?.summary || {};

  const categoryData =
    analytics?.categoryBreakdown || [];

  const trendData =
    analytics?.spendingTrend || [];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Understand your income, expenses and spending patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <select
            value={range}
            onChange={(e) =>
              setRange(e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-900"
          >
            <option value="Week">
              Week
            </option>

            <option value="Month">
              Month
            </option>

            <option value="3 Months">
              3 Months
            </option>

            <option value="Year">
              Year
            </option>
          </select>

          <button
            onClick={() =>
              fetchAnalytics(range)
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-4 md:grid-cols-3">

        {/* Income */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Income
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(
                  summary.totalIncome
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <TrendingUp size={22} />
            </div>

          </div>

        </div>

        {/* Expenses */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Expenses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(
                  summary.totalExpenses
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <TrendingDown size={22} />
            </div>

          </div>

        </div>

        {/* Savings */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Net Savings
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${
                  summary.netSavings >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(
                  summary.netSavings
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Wallet size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Category Breakdown */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Expense by Category
            </h2>

            <p className="text-sm text-gray-500">
              Where your money is being spent
            </p>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-sm text-gray-500">
              No expense data available.
            </div>
          ) : (
            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    paddingAngle={3}
                  >

                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${
                            index * 45
                          }, 70%, 55%)`}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                  />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>
          )}

        </div>

        {/* Spending Trend */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Spending Trend
            </h2>

            <p className="text-sm text-gray-500">
              Your expense activity over time
            </p>
          </div>

          {trendData.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-sm text-gray-500">
              No spending data available.
            </div>
          ) : (
            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={trendData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                    labelFormatter={(label) =>
                      formatDate(label)
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#111827"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>
          )}

        </div>

      </div>

      {/* Income vs Expense */}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Income vs Expense
          </h2>

          <p className="text-sm text-gray-500">
            Compare your earnings and spending for the selected period.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Income
            </p>

            <p className="mt-2 text-2xl font-bold text-green-700">
              {formatCurrency(
                summary.totalIncome
              )}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-5">
            <p className="text-sm text-red-700">
              Expense
            </p>

            <p className="mt-2 text-2xl font-bold text-red-700">
              {formatCurrency(
                summary.totalExpenses
              )}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;