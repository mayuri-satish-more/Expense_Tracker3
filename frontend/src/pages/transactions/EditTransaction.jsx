import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  WalletCards,
  FileText,
  IndianRupee,
  Loader2,
  Save,
  X,
  Paperclip,
  Eye,
  Upload,
  Trash2,
} from "lucide-react";

import {
  getTransactionById,
  updateTransaction,
} from "../../services/transactionService.js";

import { getAccounts } from "../../services/accountService.js";
import { getCategories } from "../../services/categoryService.js";

const expenseCategories = [
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

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  const [attachment, setAttachment] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [removeExistingAttachment, setRemoveExistingAttachment] =
    useState(false);

  const [formData, setFormData] = useState({
    type: "Expense",
    amount: "",
    category: "Food",
    accountId: "",
    date: "",
    note: "",
    isRecurring: false,
    recurringFrequency: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        transactionResponse,
        accountsResponse,
        categoriesResponse,
      ] = await Promise.all([
        getTransactionById(id),
        getAccounts(),
        getCategories(),
      ]);

      const transaction =
        transactionResponse.transaction ||
        transactionResponse;

      setAccounts(accountsResponse.accounts || []);

      setCustomCategories(
        categoriesResponse.categories || []
      );

      setExistingAttachment(
        transaction.attachment || null
      );

      setRemoveExistingAttachment(false);
      setAttachment(null);

      setFormData({
        type: transaction.type || "Expense",

        amount:
          transaction.amount?.toString() || "",

        category:
          transaction.category || "Other",

        accountId:
          transaction.accountId?._id ||
          transaction.accountId ||
          "",

        date: transaction.date
          ? new Date(transaction.date)
              .toISOString()
              .split("T")[0]
          : new Date()
              .toISOString()
              .split("T")[0],

        note: transaction.note || "",

        isRecurring:
          transaction.isRecurring || false,

        recurringFrequency:
          transaction.recurringFrequency || "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load transaction"
      );

      navigate("/transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category:
        type === "Income"
          ? "Salary"
          : "Food",
    }));
  };

  // ATTACHMENT CHANGE
  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and PDF files are allowed"
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "File size must be less than 5 MB"
      );

      e.target.value = "";
      return;
    }

    setAttachment(file);

    // If user selects a replacement,
    // don't remove the existing one separately.
    setRemoveExistingAttachment(false);

    toast.success("Attachment selected");
  };

  // REMOVE NEWLY SELECTED FILE
  const handleRemoveNewAttachment = () => {
    setAttachment(null);

    const input =
      document.getElementById(
        "edit-attachment"
      );

    if (input) {
      input.value = "";
    }
  };

  // REMOVE EXISTING ATTACHMENT
  const handleRemoveExistingAttachment = () => {
    setExistingAttachment(null);
    setRemoveExistingAttachment(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount) {
      toast.error(
        "Please enter an amount"
      );
      return;
    }

    if (Number(formData.amount) <= 0) {
      toast.error(
        "Amount must be greater than 0"
      );
      return;
    }

    if (!formData.accountId) {
      toast.error(
        "Please select an account"
      );
      return;
    }

    if (
      formData.isRecurring &&
      !formData.recurringFrequency
    ) {
      toast.error(
        "Please select recurring frequency"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        type: formData.type,

        amount: Number(
          formData.amount
        ),

        category:
          formData.category,

        accountId:
          formData.accountId,

        date:
          formData.date,

        note:
          formData.note.trim(),

        isRecurring:
          formData.isRecurring,

        recurringFrequency:
          formData.isRecurring
            ? formData.recurringFrequency
            : null,

        // New attachment
        attachment:
          attachment || undefined,

        // Tell backend to remove existing attachment
        removeAttachment:
          removeExistingAttachment
            ? "true"
            : "false",
      };

      await updateTransaction(
        id,
        payload
      );

      toast.success(
        "Transaction updated successfully!"
      );

      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update transaction"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Loading transaction...
          </p>
        </div>
      </div>
    );
  }

  const defaultCategories =
    formData.type === "Income"
      ? incomeCategories
      : expenseCategories;

  const customTypeCategories =
    customCategories
      .filter(
        (category) =>
          category.type ===
          formData.type
      )
      .map(
        (category) =>
          category.name
      );

  const categories = [
    ...defaultCategories,

    ...customTypeCategories.filter(
      (customCategory) =>
        !defaultCategories.some(
          (defaultCategory) =>
            defaultCategory.toLowerCase() ===
            customCategory.toLowerCase()
        )
    ),
  ];

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="mb-7">
        <p className="text-sm font-medium text-indigo-600">
          Finance
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Edit Transaction
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Update your transaction details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
      >

        {/* TRANSACTION TYPE */}

        <div className="p-5 sm:p-7 border-b border-slate-100">

          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Transaction Type
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() =>
                handleTypeChange(
                  "Expense"
                )
              }
              className={
                formData.type ===
                "Expense"
                  ? "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition border-red-300 bg-red-50"
                  : "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition border-slate-200 hover:border-slate-300"
              }
            >
              <div
                className={
                  formData.type ===
                  "Expense"
                    ? "w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 text-red-600"
                    : "w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500"
                }
              >
                <ArrowDown size={20} />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Expense
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Money going out
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleTypeChange(
                  "Income"
                )
              }
              className={
                formData.type ===
                "Income"
                  ? "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition border-emerald-300 bg-emerald-50"
                  : "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition border-slate-200 hover:border-slate-300"
              }
            >
              <div
                className={
                  formData.type ===
                  "Income"
                    ? "w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600"
                    : "w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500"
                }
              >
                <ArrowUp size={20} />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Income
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Money coming in
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* FORM */}

        <div className="p-5 sm:p-7 space-y-6">

          {/* AMOUNT */}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Amount
            </label>

            <div className="relative">

              <IndianRupee
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>
          </div>

          {/* CATEGORY */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          category,
                        })
                      )
                    }
                    className={
                      formData.category ===
                      category
                        ? "px-3 py-3 rounded-xl border text-sm font-medium transition border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "px-3 py-3 rounded-xl border text-sm font-medium transition border-slate-200 text-slate-600 hover:bg-slate-50"
                    }
                  >
                    {category}
                  </button>
                )
              )}

            </div>
          </div>

          {/* ACCOUNT + DATE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account / Wallet
              </label>

              <div className="relative">

                <WalletCards
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <select
                  name="accountId"
                  value={
                    formData.accountId
                  }
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map(
                    (account) => (
                      <option
                        key={
                          account._id
                        }
                        value={
                          account._id
                        }
                      >
                        {account.name}
                      </option>
                    )
                  )}
                </select>

              </div>
            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <input
                  type="date"
                  name="date"
                  value={
                    formData.date
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

              </div>
            </div>

          </div>

          {/* NOTE */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Note
            </label>

            <div className="relative">

              <FileText
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <textarea
                name="note"
                value={
                  formData.note
                }
                onChange={handleChange}
                rows="4"
                maxLength="300"
                placeholder="Add a note about this transaction..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>
          </div>

          {/* ATTACHMENT */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Attachment
            </label>

            {/* EXISTING ATTACHMENT */}

            {existingAttachment &&
              !removeExistingAttachment &&
              !attachment && (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Paperclip size={20} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-slate-800">
                          Existing attachment
                        </p>

                        <p className="text-xs text-slate-500 truncate max-w-[240px]">
                          Attachment is already uploaded
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <a
                        href={
                          existingAttachment
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <Eye size={16} />
                        View
                      </a>

                      <button
                        type="button"
                        onClick={
                          handleRemoveExistingAttachment
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>

                  </div>
                </div>
              )}

            {/* NEW FILE */}

            {attachment && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Paperclip size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {attachment.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(
                          attachment.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleRemoveNewAttachment
                    }
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-100 transition shrink-0"
                    title="Remove selected file"
                  >
                    <X size={18} />
                  </button>

                </div>

              </div>
            )}

            {/* REMOVED EXISTING */}

            {removeExistingAttachment &&
              !attachment && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                        <Trash2 size={20} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-red-700">
                          Attachment will be removed
                        </p>

                        <p className="text-xs text-red-500 mt-1">
                          Save changes to confirm.
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setRemoveExistingAttachment(
                          false
                        )
                      }
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Undo
                    </button>

                  </div>

                </div>
              )}

            {/* UPLOAD / REPLACE */}

            {!attachment && (
              <label
                htmlFor="edit-attachment"
                className="mt-3 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40 transition"
              >

                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload size={20} />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {existingAttachment &&
                  !removeExistingAttachment
                    ? "Replace attachment"
                    : "Upload attachment"}
                </p>

                <p className="text-xs text-slate-400">
                  JPG, JPEG, PNG or PDF • Maximum 5 MB
                </p>

                <input
                  id="edit-attachment"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={
                    handleAttachmentChange
                  }
                  className="hidden"
                />

              </label>
            )}

          </div>

          {/* RECURRING */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="isRecurring"
                checked={
                  formData.isRecurring
                }
                onChange={handleChange}
                className="w-5 h-5 accent-indigo-600"
              />

              <div>

                <p className="font-semibold text-slate-800">
                  Recurring transaction
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Automatically repeat this transaction.
                </p>

              </div>

            </label>

            {formData.isRecurring && (
              <div className="mt-4">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Frequency
                </label>

                <select
                  name="recurringFrequency"
                  value={
                    formData.recurringFrequency
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select frequency
                  </option>

                  <option value="Daily">
                    Daily
                  </option>

                  <option value="Weekly">
                    Weekly
                  </option>

                  <option value="Monthly">
                    Monthly
                  </option>

                  <option value="Yearly">
                    Yearly
                  </option>

                </select>

              </div>
            )}

          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-5 sm:p-7 border-t border-slate-100 bg-slate-50">

          <button
            type="button"
            onClick={() =>
              navigate("/transactions")
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            <X size={18} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}

          </button>

        </div>

      </form>
    </div>
  );
};

export default EditTransaction;
