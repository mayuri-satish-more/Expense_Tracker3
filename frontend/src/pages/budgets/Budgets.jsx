import {
  Wallet,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getBudget,
  saveBudget,
} from "../../services/budgetService.js";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Rent",
  "Entertainment",
  "Health",
  "Education",
  "Subscription",
  "Other",
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const getProgressColor = (percentage) => {
  if (percentage >= 100) {
    return "bg-red-600";
  }

  if (percentage >= 90) {
    return "bg-orange-500";
  }

  if (percentage >= 75) {
    return "bg-yellow-500";
  }

  if (percentage >= 50) {
    return "bg-blue-500";
  }

  return "bg-green-500";
};

const getWarningStyle = (warning) => {
  switch (warning) {
    case "Exceeded":
      return "bg-red-50 text-red-700";

    case "Critical":
      return "bg-orange-50 text-orange-700";

    case "High":
      return "bg-yellow-50 text-yellow-700";

    case "Moderate":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-green-50 text-green-700";
  }
};

const Budgets = () => {
  const [budgetData, setBudgetData] =
    useState(null);

  const [overallBudget, setOverallBudget] =
    useState("");

  const [categoryBudgets, setCategoryBudgets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchBudget = async () => {
    try {
      setRefreshing(true);

      const data = await getBudget();

      setBudgetData(data.budget);

      setOverallBudget(
        data.budget.overallBudget || ""
      );

      setCategoryBudgets(
        data.budget.categoryBudgets || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load budget"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const addCategoryBudget = () => {
    setCategoryBudgets([
      ...categoryBudgets,
      {
        category: "Food",
        amount: "",
      },
    ]);
  };

  const updateCategoryBudget = (
    index,
    field,
    value
  ) => {
    const updated = [
      ...categoryBudgets,
    ];

    updated[index][field] = value;

    setCategoryBudgets(updated);
  };

  const removeCategoryBudget = (index) => {
    setCategoryBudgets(
      categoryBudgets.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const cleanedCategories =
        categoryBudgets
          .filter(
            (item) =>
              item.category &&
              Number(item.amount) >= 0
          )
          .map((item) => ({
            category: item.category,
            amount: Number(item.amount),
          }));

      await saveBudget({
        overallBudget:
          Number(overallBudget) || 0,

        categoryBudgets:
          cleanedCategories,
      });

      toast.success(
        "Budget saved successfully"
      );

      await fetchBudget();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save budget"
      );
    } finally {
      setSaving(false);
    }
  };

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
      </div>
    );
  }

  const percentage = Math.min(
    budgetData?.budgetPercentage || 0,
    100
  );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Budgets
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Set monthly limits and control your spending.
          </p>
        </div>

        <button
          onClick={fetchBudget}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
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

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Monthly Budget
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(
                  budgetData?.overallBudget
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Wallet size={22} />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Spent
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(
                  budgetData?.totalSpent
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <TrendingDown size={22} />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Remaining
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${
                  (budgetData?.remainingBudget || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(
                  budgetData?.remainingBudget
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <AlertTriangle size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* Overall Budget */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Overall Monthly Budget
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your spending against your monthly limit.
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getWarningStyle(
              budgetData?.warning
            )}`}
          >
            {budgetData?.warning}
          </span>

        </div>

        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-500">
              {formatCurrency(
                budgetData?.totalSpent
              )}{" "}
              spent
            </span>

            <span className="font-semibold text-gray-700">
              {Math.round(
                budgetData?.budgetPercentage || 0
              )}
              %
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-100">

            <div
              className={`h-full rounded-full transition-all ${getProgressColor(
                budgetData?.budgetPercentage || 0
              )}`}
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>75%</span>
            <span>90%</span>
            <span>100%</span>
          </div>

        </div>

      </div>

      {/* Budget Settings */}

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Budget Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure your monthly and category budgets.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Budget"}
          </button>

        </div>

        {/* Overall */}

        <div className="mt-6">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Overall Monthly Budget
          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              ₹
            </span>

            <input
              type="number"
              min="0"
              value={overallBudget}
              onChange={(e) =>
                setOverallBudget(
                  e.target.value
                )
              }
              placeholder="30000"
              className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 outline-none transition focus:border-gray-900"
            />

          </div>

        </div>

        {/* Category budgets */}

        <div className="mt-8">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="font-semibold text-gray-900">
                Category Budgets
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Set individual limits for spending categories.
              </p>
            </div>

            <button
              type="button"
              onClick={addCategoryBudget}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Plus size={16} />
              Add
            </button>

          </div>

          <div className="mt-4 space-y-3">

            {categoryBudgets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                No category budgets added yet.
              </div>
            ) : (
              categoryBudgets.map(
                (item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-xl border border-gray-100 p-4 md:grid-cols-[1fr_1fr_auto]"
                  >

                    <select
                      value={item.category}
                      onChange={(e) =>
                        updateCategoryBudget(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                      className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
                    >
                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>

                    <div className="relative">

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={item.amount}
                        onChange={(e) =>
                          updateCategoryBudget(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        placeholder="5000"
                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-7 pr-3 text-sm outline-none focus:border-gray-900"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeCategoryBudget(
                          index
                        )
                      }
                      className="flex items-center justify-center rounded-xl border border-red-100 px-4 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </form>

      {/* Category Progress */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Category Spending
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your spending against each category limit.
          </p>
        </div>

        {budgetData?.categoryBudgets?.length === 0 ? (
          <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">
            Add category budgets to start tracking them.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {budgetData?.categoryBudgets?.map(
              (item) => (
                <div
                  key={item.category}
                  className="rounded-xl border border-gray-100 p-4"
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.category}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatCurrency(
                          item.spent
                        )}{" "}
                        of{" "}
                        {formatCurrency(
                          item.budget
                        )}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getWarningStyle(
                        item.warning
                      )}`}
                    >
                      {Math.round(
                        item.percentage
                      )}
                      %
                    </span>

                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className={`h-full rounded-full ${getProgressColor(
                        item.percentage
                      )}`}
                      style={{
                        width: `${Math.min(
                          item.percentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="mt-2 flex justify-between text-xs">

                    <span className="text-gray-500">
                      Remaining
                    </span>

                    <span
                      className={`font-medium ${
                        item.remaining >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(
                        item.remaining
                      )}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default Budgets;