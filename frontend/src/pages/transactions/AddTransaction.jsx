import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  FileText,
  WalletCards,
  Repeat,
  Utensils,
  Plane,
  ShoppingBag,
  Receipt,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  CreditCard,
  BriefcaseBusiness,
  Gift,
  TrendingUp,
  Building2,
  Tag,
} from "lucide-react";

import {
  createTransaction,
} from "../../services/transactionService.js";

import {
  getAccounts,
} from "../../services/accountService.js";

import {
  getCategories,
} from "../../services/categoryService.js";

const expenseCategories = [
  {
    name: "Food",
    icon: Utensils,
  },
  {
    name: "Travel",
    icon: Plane,
  },
  {
    name: "Shopping",
    icon: ShoppingBag,
  },
  {
    name: "Bills",
    icon: Receipt,
  },
  {
    name: "Rent",
    icon: Home,
  },
  {
    name: "Entertainment",
    icon: Gamepad2,
  },
  {
    name: "Health",
    icon: HeartPulse,
  },
  {
    name: "Education",
    icon: GraduationCap,
  },
  {
    name: "Subscription",
    icon: CreditCard,
  },
  {
    name: "Other",
    icon: CircleDollarSign,
  },
];

const incomeCategories = [
  {
    name: "Salary",
    icon: BriefcaseBusiness,
  },
  {
    name: "Freelance",
    icon: BriefcaseBusiness,
  },
  {
    name: "Business",
    icon: Building2,
  },
  {
    name: "Investment",
    icon: TrendingUp,
  },
  {
    name: "Gift",
    icon: Gift,
  },
  {
    name: "Other",
    icon: CircleDollarSign,
  },
];


const AddTransaction = () => {
  const navigate = useNavigate();

  const [type, setType] = useState("Expense");

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    accountId: "",
    note: "",
    date: new Date()
      .toISOString()
      .split("T")[0],
    isRecurring: false,
    recurringFrequency: "Monthly",
  });


const [accounts, setAccounts] = useState([]);

const [customCategories, setCustomCategories] =
  useState([]);

const [loadingAccounts, setLoadingAccounts] =
  useState(true);

const [loadingCategories, setLoadingCategories] =
  useState(true);









  const [submitting, setSubmitting] =
    useState(false);


  const defaultCategories =
  type === "Expense"
    ? expenseCategories
    : incomeCategories;

const customTypeCategories =
  customCategories
    .filter((category) => category.type === type)
    .map((category) => ({
      name: category.name,
      icon: Tag,
    }));

const categories = [
  ...defaultCategories,
  ...customTypeCategories.filter(
    (customCategory) =>
      !defaultCategories.some(
        (defaultCategory) =>
          defaultCategory.name.toLowerCase() ===
          customCategory.name.toLowerCase()
      )
  ),
];


  useEffect(() => {
    loadAccounts();
    loadCategories();
  }, []);


  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);

      const data = await getAccounts();

      setAccounts(data.accounts || []);

      if (data.accounts?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          accountId:
            prev.accountId ||
            data.accounts[0]._id,
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load accounts"
      );
    } finally {
      setLoadingAccounts(false);
    }
  };



const loadCategories = async () => {
  try {
    setLoadingCategories(true);

    const data = await getCategories();

    setCustomCategories(data.categories || []);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to load categories"
    );
  } finally {
    setLoadingCategories(false);
  }
};

  const handleTypeChange = (newType) => {
    setType(newType);

    setFormData((prev) => ({
      ...prev,
      category:
        newType === "Expense"
          ? "Food"
          : "Salary",
    }));
  };


  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount) {
      toast.error("Please enter an amount");
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

    try {
      setSubmitting(true);

      await createTransaction({
        amount: Number(formData.amount),
        type,
        category: formData.category,
        accountId: formData.accountId,
        note: formData.note,
        date: formData.date,
        isRecurring:
          formData.isRecurring,
        recurringFrequency:
          formData.isRecurring
            ? formData.recurringFrequency
            : null,
      });

      toast.success(
        "Transaction added successfully!"
      );

      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add transaction"
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">

        <button
          type="button"
          onClick={() =>
            navigate("/transactions")
          }
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <p className="text-sm font-medium text-indigo-600">
            Transactions
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Add Transaction
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Record your income or expense.
          </p>
        </div>

      </div>


      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

        {/* Type Selector */}
        <div className="p-5 sm:p-7 border-b border-slate-100">

          <p className="text-sm font-semibold text-slate-700 mb-3">
            Transaction Type
          </p>

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() =>
                handleTypeChange("Expense")
              }
              className={`rounded-2xl border p-4 text-left transition ${
                type === "Expense"
                  ? "border-red-200 bg-red-50 ring-2 ring-red-100"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    type === "Expense"
                      ? "bg-red-100 text-red-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  ↓
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Expense
                  </p>

                  <p className="text-xs text-slate-500">
                    Money going out
                  </p>
                </div>

              </div>
            </button>


            <button
              type="button"
              onClick={() =>
                handleTypeChange("Income")
              }
              className={`rounded-2xl border p-4 text-left transition ${
                type === "Income"
                  ? "border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    type === "Income"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  ↑
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Income
                  </p>

                  <p className="text-xs text-slate-500">
                    Money coming in
                  </p>
                </div>

              </div>
            </button>

          </div>
        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7 space-y-7"
        >

          {/* Amount */}
          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Amount
            </label>

            <div className="relative">

              <CircleDollarSign
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-lg font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>


          {/* Category */}
          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Category
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

              {categories.map(
                ({
                  name,
                  icon: Icon,
                }) => (

                  <button
                    type="button"
                    key={name}
                    onClick={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          category: name,
                        })
                      )
                    }
                    className={`p-3 rounded-2xl border text-left transition ${
                      formData.category === name
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
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


          {/* Account + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Account */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account / Wallet
              </label>

              <div className="relative">

                <WalletCards
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  disabled={
                    loadingAccounts
                  }
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >

                  <option value="">
                    {loadingAccounts
                      ? "Loading accounts..."
                      : "Select account"}
                  </option>

                  {accounts.map(
                    (account) => (
                      <option
                        key={account._id}
                        value={account._id}
                      >
                        {account.name} — ₹
                        {account.balance.toLocaleString(
                          "en-IN"
                        )}
                      </option>
                    )
                  )}

                </select>

              </div>

              {!loadingAccounts &&
                accounts.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    Please create an account
                    first.
                  </p>
                )}

            </div>


            {/* Date */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

              </div>

            </div>

          </div>


          {/* Note */}
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
                value={formData.note}
                onChange={handleChange}
                rows="4"
                placeholder="Add a note about this transaction..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>


          {/* Recurring */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <label className="flex items-center justify-between gap-4 cursor-pointer">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 border border-slate-200">
                  <Repeat size={18} />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Recurring Transaction
                  </p>

                  <p className="text-xs text-slate-500">
                    Automatically repeat this transaction.
                  </p>
                </div>

              </div>

              <input
                type="checkbox"
                name="isRecurring"
                checked={
                  formData.isRecurring
                }
                onChange={handleChange}
                className="w-5 h-5 accent-indigo-600"
              />

            </label>


            {formData.isRecurring && (
              <div className="mt-4">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Repeat Every
                </label>

                <select
                  name="recurringFrequency"
                  value={
                    formData.recurringFrequency
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
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


          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={() =>
                navigate("/transactions")
              }
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                loadingAccounts ||
                accounts.length === 0
              }
              className="px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              {submitting
                ? "Saving..."
                : "Save Transaction"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddTransaction;




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import {
//   ArrowLeft,
//   CalendarDays,
//   CircleDollarSign,
//   FileText,
//   WalletCards,
//   Repeat,
//   Paperclip,
//   Utensils,
//   Plane,
//   ShoppingBag,
//   Receipt,
//   Home,
//   Gamepad2,
//   HeartPulse,
//   GraduationCap,
//   CreditCard,
//   BriefcaseBusiness,
//   Gift,
//   TrendingUp,
//   Building2,
//   Tag,
//   X,
// } from "lucide-react";

// import {
//   createTransaction,
// } from "../../services/transactionService.js";

// import {
//   getAccounts,
// } from "../../services/accountService.js";

// import {
//   getCategories,
// } from "../../services/categoryService.js";

// const expenseCategories = [
//   {
//     name: "Food",
//     icon: Utensils,
//   },
//   {
//     name: "Travel",
//     icon: Plane,
//   },
//   {
//     name: "Shopping",
//     icon: ShoppingBag,
//   },
//   {
//     name: "Bills",
//     icon: Receipt,
//   },
//   {
//     name: "Rent",
//     icon: Home,
//   },
//   {
//     name: "Entertainment",
//     icon: Gamepad2,
//   },
//   {
//     name: "Health",
//     icon: HeartPulse,
//   },
//   {
//     name: "Education",
//     icon: GraduationCap,
//   },
//   {
//     name: "Subscription",
//     icon: CreditCard,
//   },
//   {
//     name: "Other",
//     icon: CircleDollarSign,
//   },
// ];

// const incomeCategories = [
//   {
//     name: "Salary",
//     icon: BriefcaseBusiness,
//   },
//   {
//     name: "Freelance",
//     icon: BriefcaseBusiness,
//   },
//   {
//     name: "Business",
//     icon: Building2,
//   },
//   {
//     name: "Investment",
//     icon: TrendingUp,
//   },
//   {
//     name: "Gift",
//     icon: Gift,
//   },
//   {
//     name: "Other",
//     icon: CircleDollarSign,
//   },
// ];

// const AddTransaction = () => {
//   const navigate = useNavigate();

//   const [type, setType] = useState("Expense");

//   const [formData, setFormData] = useState({
//     amount: "",
//     category: "Food",
//     accountId: "",
//     note: "",
//     date: new Date()
//       .toISOString()
//       .split("T")[0],
//     isRecurring: false,
//     recurringFrequency: "Monthly",
//   });

//   const [accounts, setAccounts] = useState([]);

//   const [customCategories, setCustomCategories] =
//     useState([]);

//   const [loadingAccounts, setLoadingAccounts] =
//     useState(true);

//   const [loadingCategories, setLoadingCategories] =
//     useState(true);

//   const [submitting, setSubmitting] =
//     useState(false);

//   // Attachment state
//   const [attachment, setAttachment] =
//     useState(null);

//   const defaultCategories =
//     type === "Expense"
//       ? expenseCategories
//       : incomeCategories;

//   const customTypeCategories =
//     customCategories
//       .filter(
//         (category) =>
//           category.type === type
//       )
//       .map((category) => ({
//         name: category.name,
//         icon: Tag,
//       }));

//   const categories = [
//     ...defaultCategories,
//     ...customTypeCategories.filter(
//       (customCategory) =>
//         !defaultCategories.some(
//           (defaultCategory) =>
//             defaultCategory.name.toLowerCase() ===
//             customCategory.name.toLowerCase()
//         )
//     ),
//   ];

//   useEffect(() => {
//     loadAccounts();
//     loadCategories();
//   }, []);

//   const loadAccounts = async () => {
//     try {
//       setLoadingAccounts(true);

//       const data = await getAccounts();

//       setAccounts(data.accounts || []);

//       if (data.accounts?.length > 0) {
//         setFormData((prev) => ({
//           ...prev,
//           accountId:
//             prev.accountId ||
//             data.accounts[0]._id,
//         }));
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load accounts"
//       );
//     } finally {
//       setLoadingAccounts(false);
//     }
//   };

//   const loadCategories = async () => {
//     try {
//       setLoadingCategories(true);

//       const data = await getCategories();

//       setCustomCategories(
//         data.categories || []
//       );
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load categories"
//       );
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleTypeChange = (newType) => {
//     setType(newType);

//     setFormData((prev) => ({
//       ...prev,
//       category:
//         newType === "Expense"
//           ? "Food"
//           : "Salary",
//     }));
//   };

//   const handleChange = (e) => {
//     const {
//       name,
//       value,
//       type,
//       checked,
//     } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : value,
//     }));
//   };

//   const handleAttachmentChange = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/jpg",
//       "application/pdf",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       toast.error(
//         "Only JPG, JPEG, PNG and PDF files are allowed"
//       );

//       e.target.value = "";
//       return;
//     }

//     // 5 MB
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(
//         "File size must be less than 5 MB"
//       );

//       e.target.value = "";
//       return;
//     }

//     setAttachment(file);
//   };

//   const removeAttachment = () => {
//     setAttachment(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.amount) {
//       toast.error("Please enter an amount");
//       return;
//     }

//     if (Number(formData.amount) <= 0) {
//       toast.error(
//         "Amount must be greater than 0"
//       );
//       return;
//     }

//     if (!formData.category) {
//       toast.error(
//         "Please select a category"
//       );
//       return;
//     }

//     if (!formData.accountId) {
//       toast.error(
//         "Please select an account"
//       );
//       return;
//     }

//     if (
//       formData.isRecurring &&
//       !formData.recurringFrequency
//     ) {
//       toast.error(
//         "Please select recurring frequency"
//       );
//       return;
//     }

//     try {
//       setSubmitting(true);

//       await createTransaction({
//         amount: Number(formData.amount),
//         type,
//         category: formData.category,
//         accountId: formData.accountId,
//         note: formData.note,
//         date: formData.date,

//         isRecurring:
//           formData.isRecurring,

//         recurringFrequency:
//           formData.isRecurring
//             ? formData.recurringFrequency
//             : null,

//         // Attachment
//         attachment,
//       });

//       toast.success(
//         "Transaction added successfully!"
//       );

//       navigate("/transactions");
//     } catch (error) {
//       console.error(
//         "Create transaction error:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to add transaction"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">

//       {/* Header */}
//       <div className="mb-8 flex items-center gap-4">

//         <button
//           type="button"
//           onClick={() =>
//             navigate("/transactions")
//           }
//           className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
//         >
//           <ArrowLeft size={19} />
//         </button>

//         <div>
//           <p className="text-sm font-medium text-indigo-600">
//             Transactions
//           </p>

//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
//             Add Transaction
//           </h1>

//           <p className="text-sm text-slate-500 mt-1">
//             Record your income or expense.
//           </p>
//         </div>

//       </div>

//       {/* Main Card */}
//       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

//         {/* Type Selector */}
//         <div className="p-5 sm:p-7 border-b border-slate-100">

//           <p className="text-sm font-semibold text-slate-700 mb-3">
//             Transaction Type
//           </p>

//           <div className="grid grid-cols-2 gap-3">

//             <button
//               type="button"
//               onClick={() =>
//                 handleTypeChange("Expense")
//               }
//               className={`rounded-2xl border p-4 text-left transition ${
//                 type === "Expense"
//                   ? "border-red-200 bg-red-50 ring-2 ring-red-100"
//                   : "border-slate-200 hover:bg-slate-50"
//               }`}
//             >
//               <div className="flex items-center gap-3">

//                 <div
//                   className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//                     type === "Expense"
//                       ? "bg-red-100 text-red-600"
//                       : "bg-slate-100 text-slate-500"
//                   }`}
//                 >
//                   ↓
//                 </div>

//                 <div>
//                   <p className="font-semibold text-slate-900">
//                     Expense
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     Money going out
//                   </p>
//                 </div>

//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 handleTypeChange("Income")
//               }
//               className={`rounded-2xl border p-4 text-left transition ${
//                 type === "Income"
//                   ? "border-emerald-200 bg-emerald-50 ring-2 ring-emerald-100"
//                   : "border-slate-200 hover:bg-slate-50"
//               }`}
//             >
//               <div className="flex items-center gap-3">

//                 <div
//                   className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//                     type === "Income"
//                       ? "bg-emerald-100 text-emerald-600"
//                       : "bg-slate-100 text-slate-500"
//                   }`}
//                 >
//                   ↑
//                 </div>

//                 <div>
//                   <p className="font-semibold text-slate-900">
//                     Income
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     Money coming in
//                   </p>
//                 </div>

//               </div>
//             </button>

//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 sm:p-7 space-y-7"
//         >

//           {/* Amount */}
//           <div>

//             <label className="block text-sm font-semibold text-slate-700 mb-2">
//               Amount
//             </label>

//             <div className="relative">

//               <CircleDollarSign
//                 size={19}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-lg font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//               />

//             </div>

//           </div>

//           {/* Category */}
//           <div>

//             <label className="block text-sm font-semibold text-slate-700 mb-3">
//               Category
//             </label>

//             {loadingCategories ? (
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
//                 Loading categories...
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

//                 {categories.map(
//                   ({
//                     name,
//                     icon: Icon,
//                   }) => (

//                     <button
//                       type="button"
//                       key={name}
//                       onClick={() =>
//                         setFormData(
//                           (prev) => ({
//                             ...prev,
//                             category: name,
//                           })
//                         )
//                       }
//                       className={`p-3 rounded-2xl border text-left transition ${
//                         formData.category === name
//                           ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                           : "border-slate-200 hover:bg-slate-50 text-slate-600"
//                       }`}
//                     >

//                       <Icon size={18} />

//                       <p className="text-xs font-semibold mt-2">
//                         {name}
//                       </p>

//                     </button>

//                   )
//                 )}

//               </div>
//             )}

//           </div>

//           {/* Account + Date */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

//             {/* Account */}
//             <div>

//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Account / Wallet
//               </label>

//               <div className="relative">

//                 <WalletCards
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <select
//                   name="accountId"
//                   value={formData.accountId}
//                   onChange={handleChange}
//                   disabled={
//                     loadingAccounts
//                   }
//                   className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//                 >

//                   <option value="">
//                     {loadingAccounts
//                       ? "Loading accounts..."
//                       : "Select account"}
//                   </option>

//                   {accounts.map(
//                     (account) => (
//                       <option
//                         key={account._id}
//                         value={account._id}
//                       >
//                         {account.name} — ₹
//                         {Number(
//                           account.balance || 0
//                         ).toLocaleString(
//                           "en-IN"
//                         )}
//                       </option>
//                     )
//                   )}

//                 </select>

//               </div>

//               {!loadingAccounts &&
//                 accounts.length === 0 && (
//                   <p className="text-xs text-red-500 mt-2">
//                     Please create an account
//                     first.
//                   </p>
//                 )}

//             </div>

//             {/* Date */}
//             <div>

//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Date
//               </label>

//               <div className="relative">

//                 <CalendarDays
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//                 />

//               </div>

//             </div>

//           </div>

//           {/* Note */}
//           <div>

//             <label className="block text-sm font-semibold text-slate-700 mb-2">
//               Note
//               <span className="ml-1 text-xs font-normal text-slate-400">
//                 (Optional)
//               </span>
//             </label>

//             <div className="relative">

//               <FileText
//                 size={18}
//                 className="absolute left-4 top-4 text-slate-400"
//               />

//               <textarea
//                 name="note"
//                 value={formData.note}
//                 onChange={handleChange}
//                 rows="4"
//                 maxLength="300"
//                 placeholder="Add a note about this transaction..."
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//               />

//             </div>

//             <p className="mt-1 text-right text-xs text-slate-400">
//               {formData.note.length}/300
//             </p>

//           </div>

//           <div>

//             <label className="block text-sm font-semibold text-slate-700 mb-2">
//               Attachment
//               <span className="ml-1 text-xs font-normal text-slate-400">
//                 (Optional)
//               </span>
//             </label>

//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">

//               {!attachment ? (
//                 <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30">

//                   <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
//                     <Paperclip size={20} />
//                   </div>

//                   <p className="text-sm font-semibold text-slate-700">
//                     Choose an attachment
//                   </p>

//                   <p className="mt-1 text-xs text-slate-500">
//                     JPG, JPEG, PNG or PDF
//                   </p>

//                   <p className="mt-1 text-xs text-slate-400">
//                     Maximum file size: 5 MB
//                   </p>

//                   <input
//                     type="file"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                     onChange={
//                       handleAttachmentChange
//                     }
//                     className="hidden"
//                   />

//                 </label>
//               ) : (
//                 <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-white p-3">

//                   <div className="flex min-w-0 items-center gap-3">

//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
//                       <Paperclip size={18} />
//                     </div>

//                     <div className="min-w-0">

//                       <p className="truncate text-sm font-semibold text-slate-700">
//                         {attachment.name}
//                       </p>

//                       <p className="text-xs text-slate-400">
//                         {(
//                           attachment.size /
//                           (1024 * 1024)
//                         ).toFixed(2)}{" "}
//                         MB
//                       </p>

//                     </div>

//                   </div>

//                   <button
//                     type="button"
//                     onClick={
//                       removeAttachment
//                     }
//                     className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
//                     title="Remove attachment"
//                   >
//                     <X size={18} />
//                   </button>

//                 </div>
//               )}

//             </div>

//           </div>

//           {/* Recurring */}
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

//             <label className="flex items-center justify-between gap-4 cursor-pointer">

//               <div className="flex items-center gap-3">

//                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 border border-slate-200">
//                   <Repeat size={18} />
//                 </div>

//                 <div>
//                   <p className="font-semibold text-slate-800">
//                     Recurring Transaction
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     Automatically repeat this transaction.
//                   </p>
//                 </div>

//               </div>

//               <input
//                 type="checkbox"
//                 name="isRecurring"
//                 checked={
//                   formData.isRecurring
//                 }
//                 onChange={handleChange}
//                 className="w-5 h-5 accent-indigo-600"
//               />

//             </label>

//             {formData.isRecurring && (
//               <div className="mt-4">

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Repeat Every
//                 </label>

//                 <select
//                   name="recurringFrequency"
//                   value={
//                     formData.recurringFrequency
//                   }
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
//                 >

//                   <option value="Daily">
//                     Daily
//                   </option>

//                   <option value="Weekly">
//                     Weekly
//                   </option>

//                   <option value="Monthly">
//                     Monthly
//                   </option>

//                   <option value="Yearly">
//                     Yearly
//                   </option>

//                 </select>

//               </div>
//             )}

//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

//             <button
//               type="button"
//               onClick={() =>
//                 navigate("/transactions")
//               }
//               disabled={submitting}
//               className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={
//                 submitting ||
//                 loadingAccounts ||
//                 accounts.length === 0
//               }
//               className="px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
//             >
//               {submitting
//                 ? "Uploading & Saving..."
//                 : "Save Transaction"}
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default AddTransaction;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import {
//   Search,
//   SlidersHorizontal,
//   ChevronLeft,
//   ChevronRight,
//   Pencil,
//   Trash2,
//   Download,
//   Paperclip,
//   X,
//   ArrowDownLeft,
//   ArrowUpRight,
//   ReceiptText,
// } from "lucide-react";

// import {
//   getTransactions,
//   deleteTransaction,
//   exportTransactions,
// } from "../../services/transactionService.js";

// const Transactions = () => {
//   const navigate = useNavigate();

//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");

//   const [showFilters, setShowFilters] = useState(false);

//   const [filters, setFilters] = useState({
//     type: "",
//     category: "",
//     accountId: "",
//     startDate: "",
//     endDate: "",
//     minAmount: "",
//     maxAmount: "",
//   });

//   const [accounts, setAccounts] = useState([]);

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//   });

//   const [deletingId, setDeletingId] = useState(null);

//   

//   const loadTransactions = async () => {
//     try {
//       setLoading(true);

//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//       };

//       if (search.trim()) {
//         params.search = search.trim();
//       }

//       if (filters.type) {
//         params.type = filters.type;
//       }

//       if (filters.category) {
//         params.category = filters.category;
//       }

//       if (filters.accountId) {
//         params.accountId = filters.accountId;
//       }

//       if (filters.startDate) {
//         params.startDate = filters.startDate;
//       }

//       if (filters.endDate) {
//         params.endDate = filters.endDate;
//       }

//       if (filters.minAmount) {
//         params.minAmount = filters.minAmount;
//       }

//       if (filters.maxAmount) {
//         params.maxAmount = filters.maxAmount;
//       }

//       const data = await getTransactions(params);

//       setTransactions(data.transactions || []);

//       setPagination((prev) => ({
//         ...prev,
//         total:
//           data.pagination?.total ||
//           data.total ||
//           0,
//         pages:
//           data.pagination?.pages ||
//           data.pages ||
//           1,
//       }));

//       if (data.accounts) {
//         setAccounts(data.accounts);
//       }
//     } catch (error) {
//       console.error(
//         "Load transactions error:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load transactions"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTransactions();
//   }, [
//     pagination.page,
//     pagination.limit,
//     search,
//     filters.type,
//     filters.category,
//     filters.accountId,
//     filters.startDate,
//     filters.endDate,
//     filters.minAmount,
//     filters.maxAmount,
//   ]);


//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this transaction?"
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       setDeletingId(id);

//       await deleteTransaction(id);

//       toast.success(
//         "Transaction deleted successfully"
//       );

//       loadTransactions();
//     } catch (error) {
//       console.error(
//         "Delete transaction error:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to delete transaction"
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };


//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;

//     setPagination((prev) => ({
//       ...prev,
//       page: 1,
//     }));

//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };


//   const clearFilters = () => {
//     setFilters({
//       type: "",
//       category: "",
//       accountId: "",
//       startDate: "",
//       endDate: "",
//       minAmount: "",
//       maxAmount: "",
//     });

//     setSearch("");

//     setPagination((prev) => ({
//       ...prev,
//       page: 1,
//     }));
//   };


//   const handleExport = async () => {
//     try {
//       const params = {};

//       if (search.trim()) {
//         params.search = search.trim();
//       }

//       if (filters.type) {
//         params.type = filters.type;
//       }

//       if (filters.category) {
//         params.category = filters.category;
//       }

//       if (filters.accountId) {
//         params.accountId = filters.accountId;
//       }

//       if (filters.startDate) {
//         params.startDate = filters.startDate;
//       }

//       if (filters.endDate) {
//         params.endDate = filters.endDate;
//       }

//       if (filters.minAmount) {
//         params.minAmount = filters.minAmount;
//       }

//       if (filters.maxAmount) {
//         params.maxAmount = filters.maxAmount;
//       }

//       const response =
//         await exportTransactions(params);

//       const blob = new Blob(
//         [response],
//         { type: "text/csv;charset=utf-8;" }
//       );

//       const url =
//         window.URL.createObjectURL(blob);

//       const link =
//         document.createElement("a");

//       link.href = url;

//       link.setAttribute(
//         "download",
//         "expenseflow-transactions.csv"
//       );

//       document.body.appendChild(link);

//       link.click();

//       link.remove();

//       window.URL.revokeObjectURL(url);

//       toast.success(
//         "Transactions exported successfully"
//       );
//     } catch (error) {
//       console.error(
//         "Export error:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to export transactions"
//       );
//     }
//   };


//   const formatDate = (date) => {
//     if (!date) {
//       return "-";
//     }

//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };


//   const formatAmount = (amount) => {
//     return Number(amount || 0).toLocaleString(
//       "en-IN",
//       {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }
//     );
//   };


//   const activeFilterCount =
//     Object.values(filters).filter(
//       (value) => value !== ""
//     ).length;


//   if (loading && transactions.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <p className="text-sm font-medium text-indigo-600">
//             Finance
//           </p>

//           <h1 className="text-3xl font-bold text-slate-900">
//             Transactions
//           </h1>

//           <p className="text-sm text-slate-500 mt-1">
//             Track and manage your income and expenses.
//           </p>
//         </div>

//         <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full mx-auto mb-4" />

//           <p className="text-sm text-slate-500">
//             Loading transactions...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">


//       <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

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

//         <div className="flex flex-wrap gap-3">

//           <button
//             type="button"
//             onClick={handleExport}
//             className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
//           >
//             <Download size={17} />

//             Export CSV
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               navigate("/transactions/add")
//             }
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
//           >
//             <span className="text-lg leading-none">
//               +
//             </span>

//             Add Transaction
//           </button>

//         </div>

//       </div>


//       <div className="bg-white border border-slate-200 rounded-3xl p-4 mb-5">

//         <div className="flex flex-col lg:flex-row gap-3">

//           <div className="relative flex-1">

//             <Search
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);

//                 setPagination((prev) => ({
//                   ...prev,
//                   page: 1,
//                 }));
//               }}
//               placeholder="Search by category or note..."
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//             />

//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               setShowFilters(!showFilters)
//             }
//             className="relative inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
//           >
//             <SlidersHorizontal size={17} />

//             Filters

//             {activeFilterCount > 0 && (
//               <span className="min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
//                 {activeFilterCount}
//               </span>
//             )}
//           </button>

//         </div>

//         {/* FILTER PANEL */}

//         {showFilters && (
//           <div className="mt-4 pt-4 border-t border-slate-100">

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//               {/* TYPE */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   Type
//                 </label>

//                 <select
//                   name="type"
//                   value={filters.type}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
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
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   Category
//                 </label>

//                 <input
//                   type="text"
//                   name="category"
//                   value={filters.category}
//                   onChange={handleFilterChange}
//                   placeholder="e.g. Food"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* ACCOUNT */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   Account
//                 </label>

//                 <select
//                   name="accountId"
//                   value={filters.accountId}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="">
//                     All Accounts
//                   </option>

//                   {accounts.map(
//                     (account) => (
//                       <option
//                         key={account._id}
//                         value={account._id}
//                       >
//                         {account.name}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>

//               {/* MIN AMOUNT */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   Minimum Amount
//                 </label>

//                 <input
//                   type="number"
//                   name="minAmount"
//                   value={filters.minAmount}
//                   onChange={handleFilterChange}
//                   placeholder="0"
//                   min="0"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* MAX AMOUNT */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   Maximum Amount
//                 </label>

//                 <input
//                   type="number"
//                   name="maxAmount"
//                   value={filters.maxAmount}
//                   onChange={handleFilterChange}
//                   placeholder="100000"
//                   min="0"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* START DATE */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   From Date
//                 </label>

//                 <input
//                   type="date"
//                   name="startDate"
//                   value={filters.startDate}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* END DATE */}

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-2">
//                   To Date
//                 </label>

//                 <input
//                   type="date"
//                   name="endDate"
//                   value={filters.endDate}
//                   onChange={handleFilterChange}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* CLEAR */}

//               <div className="flex items-end">

//                 <button
//                   type="button"
//                   onClick={clearFilters}
//                   className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
//                 >
//                   <X size={16} />

//                   Clear Filters
//                 </button>

//               </div>

//             </div>

//           </div>
//         )}

//       </div>

//       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

//         {/* DESKTOP HEADER */}

//         <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 px-5 py-4 bg-slate-50 border-b border-slate-200">

//           <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Transaction
//           </div>

//           <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Account
//           </div>

//           <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Date
//           </div>

//           <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
//             Amount
//           </div>

//           <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
//             Attachment
//           </div>

//           <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
//             Actions
//           </div>

//         </div>

//         {transactions.length === 0 ? (
//           <div className="p-12 text-center">

//             <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
//               <ReceiptText
//                 size={28}
//                 className="text-slate-400"
//               />
//             </div>

//             <h3 className="text-lg font-semibold text-slate-800">
//               No transactions found
//             </h3>

//             <p className="text-sm text-slate-500 mt-1">
//               Try changing your search or filters.
//             </p>

//             <button
//               type="button"
//               onClick={() =>
//                 navigate("/transactions/add")
//               }
//               className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
//             >
//               Add Transaction
//             </button>

//           </div>
//         ) : (
//           <div>

//             {transactions.map(
//               (transaction) => {

//                 const isIncome =
//                   transaction.type === "Income";

//                 return (
//                   <div
//                     key={transaction._id}
//                     className="border-b border-slate-100 last:border-b-0"
//                   >


//                     <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 items-center px-5 py-4 hover:bg-slate-50 transition">

//                       {/* TRANSACTION */}

//                       <div className="flex items-center gap-3 min-w-0">

//                         <div
//                           className={
//                             isIncome
//                               ? "w-10 h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
//                               : "w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
//                           }
//                         >
//                           {isIncome ? (
//                             <ArrowDownLeft
//                               size={18}
//                             />
//                           ) : (
//                             <ArrowUpRight
//                               size={18}
//                             />
//                           )}
//                         </div>

//                         <div className="min-w-0">

//                           <p className="font-semibold text-slate-800 truncate">
//                             {transaction.category}
//                           </p>

//                           <p className="text-xs text-slate-400 truncate mt-1">
//                             {transaction.note ||
//                               "No note"}
//                           </p>

//                         </div>

//                       </div>

//                       {/* ACCOUNT */}

//                       <div className="min-w-0">

//                         <p className="text-sm text-slate-600 truncate">
//                           {transaction.accountId
//                             ?.name ||
//                             transaction.account?.name ||
//                             "-"}
//                         </p>

//                       </div>

//                       {/* DATE */}

//                       <div>
//                         <p className="text-sm text-slate-500">
//                           {formatDate(
//                             transaction.date
//                           )}
//                         </p>
//                       </div>

//                       {/* AMOUNT */}

//                       <div className="text-right">

//                         <p
//                           className={
//                             isIncome
//                               ? "font-semibold text-emerald-600"
//                               : "font-semibold text-red-500"
//                           }
//                         >
//                           {isIncome
//                             ? "+"
//                             : "-"}
//                           ₹
//                           {formatAmount(
//                             transaction.amount
//                           )}
//                         </p>

//                       </div>

//                       {/* ATTACHMENT */}

//                       <div className="flex items-center justify-center">

//                         {transaction.attachment ? (
//                           <a
//                             href={
//                               transaction.attachment
//                             }
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             title="Open attachment"
//                             className="w-9 h-9 rounded-xl flex items-center justify-center text-indigo-500 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition"
//                           >
//                             <Paperclip
//                               size={16}
//                             />
//                           </a>
//                         ) : (
//                           <span
//                             className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-200"
//                             title="No attachment"
//                           >
//                             <Paperclip
//                               size={16}
//                             />
//                           </span>
//                         )}

//                       </div>

//                       {/* ACTIONS */}

//                       <div className="flex items-center justify-center gap-2">

//                         <button
//                           type="button"
//                           onClick={() =>
//                             navigate(
//                               `/transactions/edit/${transaction._id}`
//                             )
//                           }
//                           className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
//                           title="Edit transaction"
//                         >
//                           <Pencil
//                             size={16}
//                           />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleDelete(
//                               transaction._id
//                             )
//                           }
//                           disabled={
//                             deletingId ===
//                             transaction._id
//                           }
//                           className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
//                           title="Delete transaction"
//                         >
//                           <Trash2
//                             size={16}
//                           />
//                         </button>

//                       </div>

//                     </div>


//                     <div className="lg:hidden p-4">

//                       <div className="flex items-start gap-3">

//                         <div
//                           className={
//                             isIncome
//                               ? "w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
//                               : "w-11 h-11 shrink-0 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
//                           }
//                         >
//                           {isIncome ? (
//                             <ArrowDownLeft
//                               size={19}
//                             />
//                           ) : (
//                             <ArrowUpRight
//                               size={19}
//                             />
//                           )}
//                         </div>

//                         <div className="flex-1 min-w-0">

//                           <div className="flex items-start justify-between gap-3">

//                             <div className="min-w-0">

//                               <p className="font-semibold text-slate-800 truncate">
//                                 {transaction.category}
//                               </p>

//                               <p className="text-xs text-slate-400 mt-1 truncate">
//                                 {transaction.note ||
//                                   "No note"}
//                               </p>

//                             </div>

//                             <p
//                               className={
//                                 isIncome
//                                   ? "font-bold text-emerald-600 whitespace-nowrap"
//                                   : "font-bold text-red-500 whitespace-nowrap"
//                               }
//                             >
//                               {isIncome
//                                 ? "+"
//                                 : "-"}
//                               ₹
//                               {formatAmount(
//                                 transaction.amount
//                               )}
//                             </p>

//                           </div>

//                           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">

//                             <span className="text-xs text-slate-500">
//                               {transaction.accountId
//                                 ?.name ||
//                                 transaction.account
//                                   ?.name ||
//                                 "-"}
//                             </span>

//                             <span className="text-xs text-slate-400">
//                               {formatDate(
//                                 transaction.date
//                               )}
//                             </span>

//                           </div>

//                           <div className="flex items-center gap-2 mt-3">

//                             {/* MOBILE ATTACHMENT */}

//                             {transaction.attachment && (
//                               <a
//                                 href={
//                                   transaction.attachment
//                                 }
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
//                               >
//                                 <Paperclip
//                                   size={14}
//                                 />

//                                 View Attachment
//                               </a>
//                             )}

//                             {/* EDIT */}

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 navigate(
//                                   `/transactions/edit/${transaction._id}`
//                                 )
//                               }
//                               className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
//                             >
//                               <Pencil
//                                 size={14}
//                               />

//                               Edit
//                             </button>

//                             {/* DELETE */}

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleDelete(
//                                   transaction._id
//                                 )
//                               }
//                               disabled={
//                                 deletingId ===
//                                 transaction._id
//                               }
//                               className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition disabled:opacity-50"
//                             >
//                               <Trash2
//                                 size={14}
//                               />

//                               Delete
//                             </button>

//                           </div>

//                         </div>

//                       </div>

//                     </div>

//                   </div>
//                 );
//               }
//             )}

//           </div>
//         )}


//         {transactions.length > 0 && (
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 bg-slate-50">

//             <p className="text-sm text-slate-500">
//               Showing{" "}
//               <span className="font-semibold text-slate-700">
//                 {transactions.length}
//               </span>{" "}
//               of{" "}
//               <span className="font-semibold text-slate-700">
//                 {pagination.total}
//               </span>{" "}
//               transactions
//             </p>

//             <div className="flex items-center gap-2">

//               <button
//                 type="button"
//                 disabled={
//                   pagination.page <= 1
//                 }
//                 onClick={() =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     page: prev.page - 1,
//                   }))
//                 }
//                 className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft
//                   size={17}
//                 />
//               </button>

//               <div className="px-3 text-sm font-semibold text-slate-700">
//                 {pagination.page} /{" "}
//                 {pagination.pages}
//               </div>

//               <button
//                 type="button"
//                 disabled={
//                   pagination.page >=
//                   pagination.pages
//                 }
//                 onClick={() =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     page: prev.page + 1,
//                   }))
//                 }
//                 className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight
//                   size={17}
//                 />
//               </button>

//             </div>

//           </div>
//         )}

//       </div>

//     </div>
//   );
// };

// export default Transactions;
