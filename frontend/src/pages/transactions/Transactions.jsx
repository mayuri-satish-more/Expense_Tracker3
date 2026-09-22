import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Download,
} from "lucide-react";

import {
  getTransactions,
  deleteTransaction,
  exportTransactionsCSV,
} from "../../services/transactionService.js";

import { getAccounts } from "../../services/accountService.js";


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


const Transactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] =
    useState([]);

  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showFilters, setShowFilters] =
    useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalTransactions: 0,
    });

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    accountId: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });



  useEffect(() => {
    loadAccounts();
  }, []);


  const loadAccounts = async () => {
    try {
      const data = await getAccounts();

      setAccounts(data.accounts || []);
    } catch (error) {
      toast.error(
        "Failed to load accounts"
      );
    }
  };



  useEffect(() => {
    loadTransactions();
  }, [page, filters]);


  const loadTransactions = async () => {
    try {
      setLoading(true);

      const cleanFilters = {};

      Object.entries(filters).forEach(
        ([key, value]) => {
          if (value !== "") {
            cleanFilters[key] = value;
          }
        }
      );

      const data =
        await getTransactions({
          ...cleanFilters,
          page,
          limit: 10,
        });

      setTransactions(
        data.transactions || []
      );

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalTransactions: 0,
        }
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };



  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setPage(1);

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  

  const clearFilters = () => {
    setPage(1);

    setFilters({
      search: "",
      type: "",
      category: "",
      accountId: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
  };



  const handleDelete = async (
    transaction
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {
      await deleteTransaction(
        transaction._id
      );

      toast.success(
        "Transaction deleted successfully"
      );

      loadTransactions();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete transaction"
      );
    }
  };



const handleExportCSV = async () => {
  try {
    const cleanFilters = {};

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (value !== "") {
          cleanFilters[key] = value;
        }
      }
    );

    await exportTransactionsCSV(cleanFilters);

    toast.success(
      "Transactions exported successfully!"
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to export transactions"
    );
  }
};




  const categories =
    filters.type === "Income"
      ? incomeCategories
      : filters.type === "Expense"
      ? expenseCategories
      : [
          ...new Set([
            ...expenseCategories,
            ...incomeCategories,
          ]),
        ];


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  return (
    <div className="max-w-7xl mx-auto">


      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

        <div>

          <p className="text-sm font-medium text-indigo-600">
            Finance
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Transactions
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Track and manage your income and expenses.
          </p>

        </div>


        <button
          onClick={() =>
            navigate("/transactions/add")
          }
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm"
        >
          <Plus size={18} />
          Add Transaction
        </button>

      </div>


  
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by category or note..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />

          </div>


          {/* Filter button */}

          <button
            onClick={() =>
              setShowFilters(
                !showFilters
              )
            }
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-semibold transition ${
              showFilters
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal
              size={18}
            />
            Filters
          </button>

        </div>


        {showFilters && (

          <div className="mt-4 pt-4 border-t border-slate-100">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Type */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Type
                </label>

                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">
                    All Types
                  </option>

                  <option value="Income">
                    Income
                  </option>

                  <option value="Expense">
                    Expense
                  </option>
                </select>

              </div>


              {/* Category */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">
                    All Categories
                  </option>

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

              </div>


              {/* Account */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Account
                </label>

                <select
                  name="accountId"
                  value={filters.accountId}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                >

                  <option value="">
                    All Accounts
                  </option>

                  {accounts.map(
                    (account) => (
                      <option
                        key={account._id}
                        value={account._id}
                      >
                        {account.name}
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* Min Amount */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Minimum Amount
                </label>

                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="₹0"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* Max Amount */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Maximum Amount
                </label>

                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="₹100000"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* Start Date */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* End Date */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  To Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* Clear */}

              <div className="flex items-end">

                <button
                  onClick={clearFilters}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  <X size={17} />
                  Clear Filters
                </button>

              </div>

            </div>

          </div>

        )}

      </div>



      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

        {loading ? (

          <div className="py-20 text-center">

            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />

            <p className="text-sm text-slate-500 mt-4">
              Loading transactions...
            </p>

          </div>

        ) : transactions.length === 0 ? (

          <div className="py-20 px-6 text-center">

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">

              <ReceiptText size={28} />

            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-5">
              No transactions found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Try changing your filters or add a new transaction.
            </p>






            <button
              onClick={() =>
                navigate("/transactions/add")
              }
              className="mt-5 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700"
            >
              <Plus size={17} />
              Add Transaction
            </button>

          </div>

        ) : (

          <>

            {/* Desktop header */}

            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">

              <span>Transaction</span>
              <span>Account</span>
              <span>Date</span>
              <span className="text-right">
                Amount
              </span>
              <span></span>

            </div>


            {/* Rows */}

            <div className="divide-y divide-slate-100">

              {transactions.map(
                (transaction) => (

                  <div
                    key={transaction._id}
                    className="p-4 sm:p-5 hover:bg-slate-50 transition"
                  >

                    <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">

                      {/* Transaction */}

                      <div className="flex items-center gap-3 min-w-0">

                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            transaction.type ===
                            "Income"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >

                          {transaction.type ===
                          "Income" ? (
                            <ArrowDownLeft
                              size={20}
                            />
                          ) : (
                            <ArrowUpRight
                              size={20}
                            />
                          )}

                        </div>


                        <div className="min-w-0">

                          <p className="font-semibold text-slate-900 truncate">
                            {transaction.category}
                          </p>

                          <p className="text-xs text-slate-500 truncate mt-1">
                            {transaction.note ||
                              "No note"}
                          </p>

                        </div>

                      </div>


                      {/* Account */}

                      <div className="text-sm text-slate-600">
                        {transaction.accountId
                          ?.name ||
                          "Account"}
                      </div>


                      {/* Date */}

                      <div className="text-sm text-slate-500">
                        {formatDate(
                          transaction.date
                        )}
                      </div>


                      {/* Amount */}

                      <div
                        className={`md:text-right font-bold ${
                          transaction.type ===
                          "Income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type ===
                        "Income"
                          ? "+"
                          : "-"}
                        ₹
                        {transaction.amount.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </div>


                      {/* Actions */}

                      <div className="flex items-center gap-1">

                        <button
                          onClick={() =>
                            navigate(
                              `/transactions/edit/${transaction._id}`
                            )
                          }
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              transaction
                            )
                          }
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>


            

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-slate-100">

              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {transactions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.totalTransactions}
                </span>{" "}
                transactions
              </p>


              <div className="flex items-center gap-2">

                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                    )
                  }
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft size={17} />
                </button>


                <span className="text-sm font-semibold text-slate-700 px-2">
                  {pagination.currentPage} /{" "}
                  {pagination.totalPages}
                </span>


                <button
                  disabled={
                    page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    setPage((prev) =>
                      prev + 1
                    )
                  }
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default Transactions;









// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import {
//   Plus,
//   ArrowDownLeft,
//   ArrowUpRight,
//   ReceiptText,
//   Search,
//   SlidersHorizontal,
//   ChevronLeft,
//   ChevronRight,
//   Pencil,
//   Trash2,
//   X,
//   Download,
//   Paperclip,
// } from "lucide-react";

// import {
//   getTransactions,
//   deleteTransaction,
//   exportTransactionsCSV,
// } from "../../services/transactionService.js";

// import { getAccounts } from "../../services/accountService.js";

// const expenseCategories = [
//   "Food",
//   "Travel",
//   "Shopping",
//   "Bills",
//   "Rent",
//   "Entertainment",
//   "Health",
//   "Education",
//   "Subscription",
//   "Other",
// ];

// const incomeCategories = [
//   "Salary",
//   "Freelance",
//   "Business",
//   "Investment",
//   "Gift",
//   "Other",
// ];

// const Transactions = () => {
//   const navigate = useNavigate();

//   const [transactions, setTransactions] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);

//   const [page, setPage] = useState(1);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalTransactions: 0,
//   });

//   const [filters, setFilters] = useState({
//     search: "",
//     type: "",
//     category: "",
//     accountId: "",
//     startDate: "",
//     endDate: "",
//     minAmount: "",
//     maxAmount: "",
//   });

//   // ==========================================
//   // LOAD ACCOUNTS
//   // ==========================================

//   useEffect(() => {
//     loadAccounts();
//   }, []);

//   const loadAccounts = async () => {
//     try {
//       const data = await getAccounts();

//       setAccounts(data.accounts || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load accounts");
//     }
//   };

//   // ==========================================
//   // LOAD TRANSACTIONS
//   // ==========================================

//   useEffect(() => {
//     loadTransactions();
//   }, [page, filters]);

//   const loadTransactions = async () => {
//     try {
//       setLoading(true);

//       const cleanFilters = {};

//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== "") {
//           cleanFilters[key] = value;
//         }
//       });

//       const data = await getTransactions({
//         ...cleanFilters,
//         page,
//         limit: 10,
//       });

//       setTransactions(data.transactions || []);

//       setPagination(
//         data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalTransactions: 0,
//         }
//       );
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load transactions"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // FILTER CHANGE
//   // ==========================================

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;

//     setPage(1);

//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ==========================================
//   // CLEAR FILTERS
//   // ==========================================

//   const clearFilters = () => {
//     setPage(1);

//     setFilters({
//       search: "",
//       type: "",
//       category: "",
//       accountId: "",
//       startDate: "",
//       endDate: "",
//       minAmount: "",
//       maxAmount: "",
//     });
//   };

//   // ==========================================
//   // DELETE TRANSACTION
//   // ==========================================

//   const handleDelete = async (transaction) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this transaction?"
//     );

//     if (!confirmed) return;

//     try {
//       await deleteTransaction(transaction._id);

//       toast.success(
//         "Transaction deleted successfully"
//       );

//       loadTransactions();
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to delete transaction"
//       );
//     }
//   };

//   // ==========================================
//   // EXPORT CSV
//   // ==========================================

//   const handleExportCSV = async () => {
//     try {
//       const cleanFilters = {};

//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== "") {
//           cleanFilters[key] = value;
//         }
//       });

//       await exportTransactionsCSV(cleanFilters);

//       toast.success(
//         "Transactions exported successfully!"
//       );
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to export transactions"
//       );
//     }
//   };

//   // ==========================================
//   // CATEGORY OPTIONS
//   // ==========================================

//   const categories =
//     filters.type === "Income"
//       ? incomeCategories
//       : filters.type === "Expense"
//       ? expenseCategories
//       : [
//           ...new Set([
//             ...expenseCategories,
//             ...incomeCategories,
//           ]),
//         ];

//   // ==========================================
//   // FORMAT DATE
//   // ==========================================

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // ==========================================
//   // FORMAT AMOUNT
//   // ==========================================

//   const formatAmount = (amount) => {
//     return Number(amount).toLocaleString(
//       "en-IN",
//       {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto">

//       {/* ======================================
//           PAGE HEADER
//       ====================================== */}

//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

//         <div>
//           <p className="text-sm font-medium text-indigo-600">
//             Finance
//           </p>

//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
//             Transactions
//           </h1>

//           <p className="text-sm text-slate-500 mt-1">
//             Track and manage your income and expenses.
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">

//           {/* EXPORT */}

//           <button
//             onClick={handleExportCSV}
//             className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl font-semibold transition shadow-sm"
//           >
//             <Download size={18} />
//             Export CSV
//           </button>

//           {/* ADD */}

//           <button
//             onClick={() =>
//               navigate("/transactions/add")
//             }
//             className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm"
//           >
//             <Plus size={18} />
//             Add Transaction
//           </button>

//         </div>
//       </div>

//       {/* ======================================
//           SEARCH + FILTER
//       ====================================== */}

//       <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">

//         <div className="flex flex-col lg:flex-row gap-3">

//           {/* SEARCH */}

//           <div className="relative flex-1">

//             <Search
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               name="search"
//               value={filters.search}
//               onChange={handleFilterChange}
//               placeholder="Search by category or note..."
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//             />

//           </div>

//           {/* FILTER BUTTON */}

//           <button
//             onClick={() =>
//               setShowFilters(!showFilters)
//             }
//             className={
//               showFilters
//                 ? "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-indigo-500 bg-indigo-50 text-indigo-600 font-semibold transition"
//                 : "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition"
//             }
//           >
//             <SlidersHorizontal size={18} />
//             Filters
//           </button>

//         </div>

//         {/* ======================================
//             FILTER PANEL
//         ====================================== */}

//         {showFilters && (
//           <div className="mt-4 pt-4 border-t border-slate-100">

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//               {/* TYPE */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   Type
//                 </label>

//                 <select
//                   name="type"
//                   value={filters.type}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 >
//                   <option value="">
//                     All Types
//                   </option>

//                   <option value="Income">
//                     Income
//                   </option>

//                   <option value="Expense">
//                     Expense
//                   </option>
//                 </select>
//               </div>

//               {/* CATEGORY */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   Category
//                 </label>

//                 <select
//                   name="category"
//                   value={filters.category}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 >
//                   <option value="">
//                     All Categories
//                   </option>

//                   {categories.map((category) => (
//                     <option
//                       key={category}
//                       value={category}
//                     >
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* ACCOUNT */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   Account
//                 </label>

//                 <select
//                   name="accountId"
//                   value={filters.accountId}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 >
//                   <option value="">
//                     All Accounts
//                   </option>

//                   {accounts.map((account) => (
//                     <option
//                       key={account._id}
//                       value={account._id}
//                     >
//                       {account.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* MIN AMOUNT */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   Minimum Amount
//                 </label>

//                 <input
//                   type="number"
//                   name="minAmount"
//                   value={filters.minAmount}
//                   onChange={handleFilterChange}
//                   placeholder="₹0"
//                   min="0"
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* MAX AMOUNT */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   Maximum Amount
//                 </label>

//                 <input
//                   type="number"
//                   name="maxAmount"
//                   value={filters.maxAmount}
//                   onChange={handleFilterChange}
//                   placeholder="₹100000"
//                   min="0"
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* START DATE */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   From Date
//                 </label>

//                 <input
//                   type="date"
//                   name="startDate"
//                   value={filters.startDate}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* END DATE */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 mb-2">
//                   To Date
//                 </label>

//                 <input
//                   type="date"
//                   name="endDate"
//                   value={filters.endDate}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* CLEAR */}

//               <div className="flex items-end">

//                 <button
//                   onClick={clearFilters}
//                   className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
//                 >
//                   <X size={17} />
//                   Clear Filters
//                 </button>

//               </div>

//             </div>
//           </div>
//         )}
//       </div>

//       {/* ======================================
//           TRANSACTION CONTAINER
//       ====================================== */}

//       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

//         {/* ======================================
//             LOADING
//         ====================================== */}

//         {loading ? (

//           <div className="py-20 text-center">

//             <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />

//             <p className="text-sm text-slate-500 mt-4">
//               Loading transactions...
//             </p>

//           </div>

//         ) : transactions.length === 0 ? (

//           /* ======================================
//              EMPTY STATE
//           ====================================== */

//           <div className="py-20 px-6 text-center">

//             <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">

//               <ReceiptText size={28} />

//             </div>

//             <h3 className="text-lg font-bold text-slate-900 mt-5">
//               No transactions found
//             </h3>

//             <p className="text-sm text-slate-500 mt-2">
//               Try changing your filters or add a new transaction.
//             </p>

//             <button
//               onClick={() =>
//                 navigate("/transactions/add")
//               }
//               className="mt-5 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
//             >
//               <Plus size={17} />
//               Add Transaction
//             </button>

//           </div>

//         ) : (

//           <>
//             {/* ======================================
//                 DESKTOP TABLE HEADER
//             ====================================== */}

//             <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 px-5 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">

//               <span>
//                 Transaction
//               </span>

//               <span>
//                 Account
//               </span>

//               <span>
//                 Date
//               </span>

//               <span className="text-right">
//                 Amount
//               </span>

//               <span className="text-center">
//                 Attachment
//               </span>

//               <span></span>

//             </div>

//             {/* ======================================
//                 TRANSACTION ROWS
//             ====================================== */}

//             <div className="divide-y divide-slate-100">

//               {transactions.map((transaction) => (

//                 <div
//                   key={transaction._id}
//                   className="p-4 sm:p-5 hover:bg-slate-50 transition"
//                 >

//                   <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 items-center">

//                     {/* TRANSACTION */}

//                     <div className="flex items-center gap-3 min-w-0">

//                       <div
//                         className={
//                           transaction.type === "Income"
//                             ? "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600"
//                             : "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-red-50 text-red-600"
//                         }
//                       >
//                         {transaction.type === "Income" ? (
//                           <ArrowDownLeft size={20} />
//                         ) : (
//                           <ArrowUpRight size={20} />
//                         )}
//                       </div>

//                       <div className="min-w-0">

//                         <p className="font-semibold text-slate-900 truncate">
//                           {transaction.category}
//                         </p>

//                         <p className="text-xs text-slate-500 truncate mt-1">
//                           {transaction.note || "No note"}
//                         </p>

//                       </div>

//                     </div>

//                     {/* ACCOUNT */}

//                     <div className="text-sm text-slate-600">
//                       {transaction.accountId?.name ||
//                         "Account"}
//                     </div>

//                     {/* DATE */}

//                     <div className="text-sm text-slate-500">
//                       {formatDate(transaction.date)}
//                     </div>

//                     {/* AMOUNT */}

//                     <div
//                       className={
//                         transaction.type === "Income"
//                           ? "md:text-right font-bold text-emerald-600"
//                           : "md:text-right font-bold text-red-600"
//                       }
//                     >
//                       {transaction.type === "Income"
//                         ? "+"
//                         : "-"}
//                       ₹
//                       {formatAmount(
//                         transaction.amount
//                       )}
//                     </div>

//                     {/* ==================================
//                         ATTACHMENT
//                     ================================== */}

//                     <div className="flex items-center justify-center">

//                       {transaction.attachment ? (

//                         <a
//                           href={transaction.attachment}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-9 h-9 rounded-xl flex items-center justify-center text-indigo-500 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition"
//                           title="View Attachment"
//                         >
//                           <Paperclip size={16} />
//                         </a>

//                       ) : (

//                         <span
//                           className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-200"
//                           title="No Attachment"
//                         >
//                           <Paperclip size={16} />
//                         </span>

//                       )}

//                     </div>

//                     {/* ACTIONS */}

//                     <div className="flex items-center gap-1">

//                       {/* EDIT */}

//                       <button
//                         onClick={() =>
//                           navigate(
//                             `/transactions/edit/${transaction._id}`
//                           )
//                         }
//                         className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
//                         title="Edit"
//                       >
//                         <Pencil size={16} />
//                       </button>

//                       {/* DELETE */}

//                       <button
//                         onClick={() =>
//                           handleDelete(transaction)
//                         }
//                         className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
//                         title="Delete"
//                       >
//                         <Trash2 size={16} />
//                       </button>

//                     </div>

//                   </div>

//                   {/* ==================================
//                       MOBILE ATTACHMENT
//                   ================================== */}

//                   {transaction.attachment && (
//                     <div className="md:hidden mt-3 flex justify-end">

//                       <a
//                         href={transaction.attachment}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
//                       >
//                         <Paperclip size={14} />
//                         View Attachment
//                       </a>

//                     </div>
//                   )}

//                 </div>

//               ))}

//             </div>

//             {/* ======================================
//                 PAGINATION
//             ====================================== */}

//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-slate-100">

//               <p className="text-sm text-slate-500">

//                 Showing{" "}

//                 <span className="font-semibold text-slate-700">
//                   {transactions.length}
//                 </span>

//                 {" "}of{" "}

//                 <span className="font-semibold text-slate-700">
//                   {pagination.totalTransactions}
//                 </span>

//                 {" "}transactions

//               </p>

//               <div className="flex items-center gap-2">

//                 {/* PREVIOUS */}

//                 <button
//                   disabled={page <= 1}
//                   onClick={() =>
//                     setPage((prev) =>
//                       Math.max(prev - 1, 1)
//                     )
//                   }
//                   className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition"
//                 >
//                   <ChevronLeft size={17} />
//                 </button>

//                 {/* CURRENT PAGE */}

//                 <span className="text-sm font-semibold text-slate-700 px-2">
//                   {pagination.currentPage} /{" "}
//                   {pagination.totalPages}
//                 </span>

//                 {/* NEXT */}

//                 <button
//                   disabled={
//                     page >= pagination.totalPages
//                   }
//                   onClick={() =>
//                     setPage((prev) =>
//                       prev + 1
//                     )
//                   }
//                   className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition"
//                 >
//                   <ChevronRight size={17} />
//                 </button>

//               </div>

//             </div>

//           </>

//         )}

//       </div>

//     </div>
//   );
// };

// export default Transactions;