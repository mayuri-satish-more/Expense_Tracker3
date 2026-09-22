import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Wallet,
  Landmark,
  CreditCard,
  PiggyBank,
  Banknote,
  Pencil,
  Trash2,
  X,
  ArrowUpRight,
} from "lucide-react";

import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../services/accountService.js";


const accountTypes = [
  {
    name: "Cash",
    icon: Banknote,
  },
  {
    name: "Bank Account",
    icon: Landmark,
  },
  {
    name: "Credit Card",
    icon: CreditCard,
  },
  {
    name: "Wallet",
    icon: Wallet,
  },
  {
    name: "Savings",
    icon: PiggyBank,
  },
];


const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingAccount, setEditingAccount] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Cash",
    balance: "",
  });


  // ==============================
  // LOAD ACCOUNTS
  // ==============================

  useEffect(() => {
    loadAccounts();
  }, []);


  const loadAccounts = async () => {
    try {
      setLoading(true);

      const data = await getAccounts();

      setAccounts(data.accounts || []);
      setTotalBalance(data.totalBalance || 0);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load accounts"
      );
    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // OPEN CREATE MODAL
  // ==============================

  const openCreateModal = () => {
    setEditingAccount(null);

    setFormData({
      name: "",
      type: "Cash",
      balance: "",
    });

    setShowModal(true);
  };


  // ==============================
  // OPEN EDIT MODAL
  // ==============================

  const openEditModal = (account) => {
    setEditingAccount(account);

    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
    });

    setShowModal(true);
  };


  // ==============================
  // CLOSE MODAL
  // ==============================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingAccount(null);
  };


  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==============================
  // SAVE ACCOUNT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter account name");
      return;
    }

    if (!formData.type) {
      toast.error("Please select account type");
      return;
    }

    if (
      !editingAccount &&
      Number(formData.balance) < 0
    ) {
      toast.error(
        "Balance cannot be negative"
      );
      return;
    }

    try {
      setSaving(true);

      if (editingAccount) {
        await updateAccount(
          editingAccount._id,
          {
            name: formData.name,
            type: formData.type,
          }
        );

        toast.success(
          "Account updated successfully"
        );
      } else {
        await createAccount({
          name: formData.name,
          type: formData.type,
          balance:
            Number(formData.balance) || 0,
        });

        toast.success(
          "Account created successfully"
        );
      }

      setShowModal(false);
      setEditingAccount(null);

      await loadAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save account"
      );
    } finally {
      setSaving(false);
    }
  };


  // ==============================
  // DELETE ACCOUNT
  // ==============================

  const handleDelete = async (account) => {
    const confirmed = window.confirm(
      `Delete "${account.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteAccount(account._id);

      toast.success(
        "Account deleted successfully"
      );

      await loadAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete account"
      );
    }
  };


  // ==============================
  // GET ICON
  // ==============================

  const getAccountIcon = (type) => {
    const found = accountTypes.find(
      (item) => item.name === type
    );

    const Icon = found?.icon || Wallet;

    return <Icon size={23} />;
  };


  return (
    <div className="max-w-7xl mx-auto">

      {/* =================================
          HEADER
      ================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <p className="text-sm font-medium text-indigo-600">
            Money Management
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Accounts & Wallets
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your cash, bank accounts,
            cards and savings.
          </p>
        </div>


        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm"
        >
          <Plus size={18} />
          Add Account
        </button>

      </div>


      {/* =================================
          TOTAL BALANCE
      ================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white shadow-lg mb-7">

        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10" />

        <div className="absolute -right-5 -bottom-20 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative">

          <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium">
            <Wallet size={17} />
            Combined Balance
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            ₹
            {totalBalance.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
              }
            )}
          </h2>

          <div className="flex items-center gap-2 mt-3 text-sm text-indigo-100">
            <ArrowUpRight size={16} />
            Across all active accounts
          </div>

        </div>

      </div>


      {/* =================================
          ACCOUNT CARDS
      ================================= */}

      {loading ? (

        <div className="bg-white border border-slate-200 rounded-3xl py-20 text-center">

          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-4">
            Loading accounts...
          </p>

        </div>

      ) : accounts.length === 0 ? (

        <div className="bg-white border border-slate-200 rounded-3xl py-20 px-6 text-center">

          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Wallet size={28} />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-5">
            No accounts yet
          </h3>

          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Add your first account or wallet to
            start tracking your transactions.
          </p>

          <button
            onClick={openCreateModal}
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <Plus size={18} />
            Create Your First Account
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {accounts.map((account) => (

            <div
              key={account._id}
              className="group bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-lg hover:border-indigo-100 transition"
            >

              {/* Card top */}

              <div className="flex items-start justify-between">

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600"
                >
                  {getAccountIcon(
                    account.type
                  )}
                </div>


                <div className="flex items-center gap-1">

                  <button
                    onClick={() =>
                      openEditModal(account)
                    }
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(account)
                    }
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>


              {/* Account info */}

              <div className="mt-5">

                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {account.type}
                </p>

                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {account.name}
                </h3>

                <p className="text-2xl font-bold text-slate-900 mt-4">
                  ₹
                  {account.balance.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </p>

              </div>


              {/* Bottom */}

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                <span className="text-xs text-slate-400">
                  Available balance
                </span>

                <span className="w-2 h-2 rounded-full bg-emerald-500" />

              </div>

            </div>

          ))}

        </div>

      )}


      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}

          <div
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />


          {/* Modal */}

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Modal header */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingAccount
                    ? "Edit Account"
                    : "Add New Account"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingAccount
                    ? "Update your account details."
                    : "Add an account to track your money."}
                </p>
              </div>


              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Account name */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. HDFC Bank"
                  maxLength={50}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

              </div>


              {/* Account type */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Type
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  {accountTypes.map(
                    ({
                      name,
                      icon: Icon,
                    }) => (

                      <button
                        key={name}
                        type="button"
                        onClick={() =>
                          setFormData(
                            (prev) => ({
                              ...prev,
                              type: name,
                            })
                          )
                        }
                        className={`p-3 rounded-xl border text-left transition ${
                          formData.type ===
                          name
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >

                        <Icon size={18} />

                        <p className="text-xs font-semibold mt-2">
                          {name}
                        </p>

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* Initial balance */}

              {!editingAccount && (

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Initial Balance
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />

                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    You can start with ₹0 if you
                    don't want to add an initial balance.
                  </p>

                </div>

              )}


              {/* Buttons */}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingAccount
                    ? "Update Account"
                    : "Create Account"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Accounts;