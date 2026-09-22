
import {
  Target,
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  X,
  Save,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../../services/savingsGoalService.js";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const initialForm = {
  name: "",
  targetAmount: "",
  savedAmount: "",
  targetDate: "",
  description: "",
};

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  const fetchGoals = async () => {
    try {
      setRefreshing(true);

      const data =
        await getSavingsGoals();

      setGoals(data.goals || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load savings goals"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openCreateModal = () => {
    setEditingGoal(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);

    setForm({
      name: goal.name || "",
      targetAmount:
        goal.targetAmount || "",
      savedAmount:
        goal.savedAmount || "",
      targetDate: goal.targetDate
        ? new Date(goal.targetDate)
            .toISOString()
            .split("T")[0]
        : "",
      description:
        goal.description || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingGoal(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Please enter a goal name"
      );
      return;
    }

    if (
      !form.targetAmount ||
      Number(form.targetAmount) <= 0
    ) {
      toast.error(
        "Please enter a valid target amount"
      );
      return;
    }

    if (
      Number(form.savedAmount || 0) >
      Number(form.targetAmount)
    ) {
      toast.error(
        "Saved amount cannot exceed target amount"
      );
      return;
    }

    try {
      setSaving(true);

      const goalData = {
        name: form.name.trim(),

        targetAmount:
          Number(form.targetAmount),

        savedAmount:
          Number(form.savedAmount || 0),

        targetDate:
          form.targetDate || null,

        description:
          form.description.trim(),
      };

      if (editingGoal) {
        await updateSavingsGoal(
          editingGoal._id,
          goalData
        );

        toast.success(
          "Savings goal updated"
        );
      } else {
        await createSavingsGoal(
          goalData
        );

        toast.success(
          "Savings goal created"
        );
      }

      closeModal();

      await fetchGoals();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save savings goal"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) return;

    try {
      await deleteSavingsGoal(id);

      toast.success(
        "Savings goal deleted"
      );

      await fetchGoals();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete savings goal"
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-200" />

        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  const totalTarget = goals.reduce(
    (total, goal) =>
      total + Number(goal.targetAmount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total + Number(goal.savedAmount || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Savings Goals
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Set goals and track your progress towards them.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={fetchGoals}
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

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Plus size={17} />

            New Goal
          </button>

        </div>

      </div>

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Goals
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {goals.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Target
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(totalTarget)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Saved
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(totalSaved)}
          </p>
        </div>

      </div>

      {/* Goals */}

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Target size={28} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No savings goals yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create your first goal and start tracking your savings.
          </p>

          <button
            onClick={openCreateModal}
            className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Create Goal
          </button>

        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">

          {goals.map((goal) => {

            const progress =
              Math.min(
                Number(goal.progress || 0),
                100
              );

            return (
              <div
                key={goal._id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Target size={22} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {goal.name}
                      </h2>

                      {goal.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {goal.description}
                        </p>
                      )}
                    </div>

                  </div>

                  <div className="flex gap-1">

                    <button
                      onClick={() =>
                        openEditModal(goal)
                      }
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          goal._id
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

                <div className="mt-6 flex items-end justify-between">

                  <div>
                    <p className="text-xs text-gray-500">
                      Saved
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {formatCurrency(
                        goal.savedAmount
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Target
                    </p>

                    <p className="mt-1 font-semibold text-gray-700">
                      {formatCurrency(
                        goal.targetAmount
                      )}
                    </p>
                  </div>

                </div>

                <div className="mt-5">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="text-gray-500">
                      Progress
                    </span>

                    <span className="font-semibold text-blue-600">
                      {Math.round(
                        progress
                      )}
                      %
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="mt-4 flex justify-between text-xs">

                  <span className="text-gray-500">
                    Remaining
                  </span>

                  <span className="font-medium text-gray-700">
                    {formatCurrency(
                      goal.remainingAmount
                    )}
                  </span>

                </div>

                {goal.targetDate && (
                  <div className="mt-3 text-xs text-gray-500">
                    Target date:{" "}
                    {new Date(
                      goal.targetDate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                )}

                {goal.isCompleted && (
                  <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    🎉 Goal completed!
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

      {/* Modal */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingGoal
                    ? "Edit Savings Goal"
                    : "Create Savings Goal"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Define your savings target and track your progress.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Goal Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="New Laptop"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Target Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      name="targetAmount"
                      value={
                        form.targetAmount
                      }
                      onChange={handleChange}
                      placeholder="80000"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 text-sm outline-none focus:border-gray-900"
                    />

                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Saved Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      name="savedAmount"
                      value={
                        form.savedAmount
                      }
                      onChange={handleChange}
                      placeholder="15000"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 text-sm outline-none focus:border-gray-900"
                    />

                  </div>
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Target Date
                </label>

                <input
                  type="date"
                  name="targetDate"
                  value={
                    form.targetDate
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows="3"
                  placeholder="What are you saving for?"
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : editingGoal
                    ? "Update Goal"
                    : "Create Goal"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default SavingsGoals;
