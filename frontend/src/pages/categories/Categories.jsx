import { useEffect, useState } from "react";
import { Plus, Trash2, Tag, Wallet, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../services/categoryService.js";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Expense",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setSaving(true);

      const data = await createCategory({
        name: formData.name.trim(),
        type: formData.type,
      });

      setCategories((prev) => [...prev, data.category]);

      setFormData({
        name: "",
        type: "Expense",
      });

      toast.success("Category created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((category) => category._id !== id)
      );

      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  };

  const expenseCategories = categories.filter(
    (category) => category.type === "Expense"
  );

  const incomeCategories = categories.filter(
    (category) => category.type === "Income"
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Personalize your finances
        </p>

        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
          Custom Categories
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create your own income and expense categories.
        </p>
      </div>

      {/* Create Category */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Plus className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Add New Category
            </h2>

            <p className="text-sm text-slate-500">
              Create a category that fits your spending habits.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Gym, Bonus"
              maxLength={50}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />

              {saving ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading categories...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Expense */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Expense Categories
                  </h2>

                  <p className="text-xs text-slate-500">
                    {expenseCategories.length} custom categories
                  </p>
                </div>
              </div>
            </div>

            {expenseCategories.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Tag className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                <p className="text-sm font-medium text-slate-600">
                  No expense categories
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Create your first custom expense category.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                        <Tag className="h-4 w-4 text-red-500" />
                      </div>

                      <span className="text-sm font-medium text-slate-800">
                        {category.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Income */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Income Categories
                  </h2>

                  <p className="text-xs text-slate-500">
                    {incomeCategories.length} custom categories
                  </p>
                </div>
              </div>
            </div>

            {incomeCategories.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Tag className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                <p className="text-sm font-medium text-slate-600">
                  No income categories
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Create your first custom income category.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomeCategories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                        <Tag className="h-4 w-4 text-emerald-600" />
                      </div>

                      <span className="text-sm font-medium text-slate-800">
                        {category.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Categories;
