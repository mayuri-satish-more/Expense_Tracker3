// import Transaction from "../models/Transaction.js";
// import Account from "../models/Account.js";
// import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
// import {
//   calculateNextOccurrence,
// } from "../utils/recurringUtils.js";



// export const createTransaction = async (req, res) => {
//   try {
//     const {
//       amount,
//       type,
//       category,
//       accountId,
//       note,
//       date,
//       attachment,
//       isRecurring,
//       recurringFrequency,
//       nextOccurrence,
//     } = req.body;

//     // Basic validation
//     if (!amount || !type || !category || !accountId) {
//       return res.status(400).json({
//         message:
//           "Amount, type, category and account are required",
//       });
//     }

//     if (!["Income", "Expense"].includes(type)) {
//       return res.status(400).json({
//         message: "Invalid transaction type",
//       });
//     }

//     if (isRecurring && !recurringFrequency) {
//   return res.status(400).json({
//     message:
//       "Recurring frequency is required for recurring transactions",
//   });
// }


//     if (Number(amount) <= 0) {
//       return res.status(400).json({
//         message: "Amount must be greater than 0",
//       });
//     }

//     // IMPORTANT:
//     // Account must belong to logged-in user
//     const account = await Account.findOne({
//       _id: accountId,
//       userId: req.user._id,
//       isActive: true,
//     });

//     if (!account) {
//       return res.status(404).json({
//         message: "Account not found",
//       });
//     }

//     // Create transaction
//     const transaction = await Transaction.create({
//       userId: req.user._id,
//       accountId,
//       amount: Number(amount),
//       type,
//       category: category.trim(),
//       note: note?.trim() || "",
//       date: date || new Date(),
//       attachment: attachment || null,
//       isRecurring: Boolean(isRecurring),
//       recurringFrequency:
//         isRecurring && recurringFrequency
//           ? recurringFrequency
//           : null,
//       // nextOccurrence:
//       //   isRecurring && nextOccurrence
//       //     ? nextOccurrence
//       //     : null,

//       nextOccurrence:
//   isRecurring && recurringFrequency
//     ? calculateNextOccurrence(
//         date || new Date(),
//         recurringFrequency
//       )
//     : null,
//     });

    
//     // if (type === "Income") {
//     //   account.balance += Number(amount);
//     // } else {
//     //   account.balance -= Number(amount);
//     // }

//     // await account.save();


//     // Update account balance
// if (type === "Income") {
//   account.balance += Number(amount);
// } else {
//   const expenseAmount = Number(amount);

//   // Prevent spending more than available balance
//   if (account.balance < expenseAmount) {
//     return res.status(400).json({
//       message: `Insufficient balance. Available balance is ₹${account.balance.toFixed(
//         2
//       )}.`,
//     });
//   }

//   account.balance -= expenseAmount;
// }

// await account.save();

//     const populatedTransaction =
//       await Transaction.findById(transaction._id)
//         .populate("accountId", "name type balance");

//     res.status(201).json({
//       message: "Transaction created successfully",
//       transaction: populatedTransaction,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to create transaction",
//       error: error.message,
//     });
//   }
// };



// export const getTransactions = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       type,
//       category,
//       accountId,
//       startDate,
//       endDate,
//       minAmount,
//       maxAmount,
//       search,
//     } = req.query;

//     const currentPage = Math.max(Number(page), 1);
//     const pageLimit = Math.min(
//       Math.max(Number(limit), 1),
//       50
//     );

//     const filter = {
//       userId: req.user._id,
//       isActive: true,
//     };

//     // Type filter
//     if (type && ["Income", "Expense"].includes(type)) {
//       filter.type = type;
//     }

//     // Category filter
//     if (category) {
//       filter.category = category;
//     }

//     // Account filter
//     if (accountId) {
//       filter.accountId = accountId;
//     }

//     // Date filter
//     if (startDate || endDate) {
//       filter.date = {};

//       if (startDate) {
//         filter.date.$gte = new Date(startDate);
//       }

//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);

//         filter.date.$lte = end;
//       }
//     }

//     // Amount filter
//     if (minAmount || maxAmount) {
//       filter.amount = {};

//       if (minAmount) {
//         filter.amount.$gte = Number(minAmount);
//       }

//       if (maxAmount) {
//         filter.amount.$lte = Number(maxAmount);
//       }
//     }

//     // Search
//     if (search) {
//       const searchRegex = new RegExp(
//         search,
//         "i"
//       );

//       filter.$or = [
//         {
//           note: searchRegex,
//         },
//         {
//           category: searchRegex,
//         },
//       ];
//     }

//     const skip =
//       (currentPage - 1) * pageLimit;

//     const [transactions, totalTransactions] =
//       await Promise.all([
//         Transaction.find(filter)
//           .populate(
//             "accountId",
//             "name type balance"
//           )
//           .sort({ date: -1, createdAt: -1 })
//           .skip(skip)
//           .limit(pageLimit),

//         Transaction.countDocuments(filter),
//       ]);

//     const totalPages = Math.ceil(
//       totalTransactions / pageLimit
//     );

//     res.status(200).json({
//       transactions,
//       pagination: {
//         currentPage,
//         pageLimit,
//         totalTransactions,
//         totalPages,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch transactions",
//       error: error.message,
//     });
//   }
// };



// export const getTransactionById = async (
//   req,
//   res
// ) => {
//   try {
//     const transaction =
//       await Transaction.findOne({
//         _id: req.params.id,
//         userId: req.user._id,
//         isActive: true,
//       }).populate(
//         "accountId",
//         "name type balance"
//       );

//     if (!transaction) {
//       return res.status(404).json({
//         message: "Transaction not found",
//       });
//     }

//     res.status(200).json({
//       transaction,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch transaction",
//       error: error.message,
//     });
//   }
// };


// export const updateTransaction = async (
//   req,
//   res
// ) => {
//   try {
//     const transaction =
//       await Transaction.findOne({
//         _id: req.params.id,
//         userId: req.user._id,
//         isActive: true,
//       });

//     if (!transaction) {
//       return res.status(404).json({
//         message: "Transaction not found",
//       });
//     }

//     const oldAmount = transaction.amount;
//     const oldType = transaction.type;
//     const oldAccountId = transaction.accountId;

//     const {
//       amount,
//       type,
//       category,
//       accountId,
//       note,
//       date,
//       attachment,
//       isRecurring,
//       recurringFrequency,
//       nextOccurrence,
//     } = req.body;

//     // Determine new values
//     const newAmount =
//       amount !== undefined
//         ? Number(amount)
//         : oldAmount;

//     const newType =
//       type !== undefined
//         ? type
//         : oldType;

//     const newAccountId =
//       accountId || oldAccountId;

//     if (newAmount <= 0) {
//       return res.status(400).json({
//         message: "Amount must be greater than 0",
//       });
//     }

//     if (!["Income", "Expense"].includes(newType)) {
//       return res.status(400).json({
//         message: "Invalid transaction type",
//       });
//     }

//     // Verify new account belongs to user
//     const newAccount =
//       await Account.findOne({
//         _id: newAccountId,
//         userId: req.user._id,
//         isActive: true,
//       });

//     if (!newAccount) {
//       return res.status(404).json({
//         message: "Account not found",
//       });
//     }

//     // Find old account
//     const oldAccount =
//       await Account.findOne({
//         _id: oldAccountId,
//         userId: req.user._id,
//       });

//     // Revert old transaction effect
//     if (oldAccount) {
//       if (oldType === "Income") {
//         oldAccount.balance -= oldAmount;
//       } else {
//         oldAccount.balance += oldAmount;
//       }

//       await oldAccount.save();
//     }

    
// if (newType === "Income") {
//   newAccount.balance += newAmount;
// } else {
//   // Prevent negative balance
//   if (newAccount.balance < newAmount) {
//     return res.status(400).json({
//       message: `Insufficient balance. Available balance is ₹${newAccount.balance.toFixed(
//         2
//       )}.`,
//     });
//   }

//   newAccount.balance -= newAmount;
// }

// await newAccount.save();

//     // Update transaction
//     transaction.amount = newAmount;
//     transaction.type = newType;

//     if (category !== undefined) {
//       transaction.category =
//         category.trim();
//     }

//     if (accountId !== undefined) {
//       transaction.accountId =
//         accountId;
//     }

//     if (note !== undefined) {
//       transaction.note =
//         note.trim();
//     }

//     if (date !== undefined) {
//       transaction.date = date;
//     }

//     if (attachment !== undefined) {
//       transaction.attachment =
//         attachment;
//     }

//     if (isRecurring !== undefined) {
//       transaction.isRecurring =
//         Boolean(isRecurring);
//     }

//     if (recurringFrequency !== undefined) {
//       transaction.recurringFrequency =
//         recurringFrequency;
//     }

//     if (isRecurring !== undefined) {
//   transaction.isRecurring =
//     Boolean(isRecurring);
// }

// if (recurringFrequency !== undefined) {
//   transaction.recurringFrequency =
//     recurringFrequency;
// }

// if (transaction.isRecurring) {
//   transaction.nextOccurrence =
//     calculateNextOccurrence(
//       transaction.date,
//       transaction.recurringFrequency
//     );
// } else {
//   transaction.nextOccurrence = null;
// }

//     await transaction.save();

//     const updatedTransaction =
//       await Transaction.findById(
//         transaction._id
//       ).populate(
//         "accountId",
//         "name type balance"
//       );

//     res.status(200).json({
//       message:
//         "Transaction updated successfully",
//       transaction: updatedTransaction,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update transaction",
//       error: error.message,
//     });
//   }
// };



// export const deleteTransaction = async (
//   req,
//   res
// ) => {
//   try {
//     const transaction =
//       await Transaction.findOne({
//         _id: req.params.id,
//         userId: req.user._id,
//         isActive: true,
//       });

//     if (!transaction) {
//       return res.status(404).json({
//         message: "Transaction not found",
//       });
//     }

//     const account =
//       await Account.findOne({
//         _id: transaction.accountId,
//         userId: req.user._id,
//       });

//     // Revert account balance
//     if (account) {
//       if (transaction.type === "Income") {
//         account.balance -= transaction.amount;
//       } else {
//         account.balance += transaction.amount;
//       }

//       await account.save();
//     }

//     transaction.isActive = false;

//     await transaction.save();

//     res.status(200).json({
//       message:
//         "Transaction deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete transaction",
//       error: error.message,
//     });
//   }
// };





// export const exportTransactionsCSV = async (req, res) => {
//   try {
//     const {
//       type,
//       category,
//       accountId,
//       startDate,
//       endDate,
//       minAmount,
//       maxAmount,
//       search,
//     } = req.query;

//     const filter = {
//       userId: req.user._id,
//       isActive: true,
//     };

//     if (type) {
//       filter.type = type;
//     }

//     if (category) {
//       filter.category = category;
//     }

//     if (accountId) {
//       filter.accountId = accountId;
//     }

//     if (startDate || endDate) {
//       filter.date = {};

//       if (startDate) {
//         filter.date.$gte = new Date(`${startDate}T00:00:00`);
//       }

//       if (endDate) {
//         filter.date.$lte = new Date(`${endDate}T23:59:59`);
//       }
//     }

//     if (minAmount || maxAmount) {
//       filter.amount = {};

//       if (minAmount) {
//         filter.amount.$gte = Number(minAmount);
//       }

//       if (maxAmount) {
//         filter.amount.$lte = Number(maxAmount);
//       }
//     }

//     if (search) {
//       filter.$or = [
//         {
//           note: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           category: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//       ];
//     }

//     const transactions = await Transaction.find(filter)
//       .populate("accountId", "name")
//       .sort({ date: -1 });

//     const csvRows = [];

//     csvRows.push(
//       [
//         "Date",
//         "Type",
//         "Category",
//         "Account",
//         "Amount",
//         "Note",
//       ]
//         .map((value) => `"${value}"`)
//         .join(",")
//     );

//     transactions.forEach((transaction) => {
//       const date = new Date(transaction.date)
//         .toISOString()
//         .split("T")[0];

//       const account =
//         transaction.accountId?.name || "Unknown";

//       const row = [
//         date,
//         transaction.type,
//         transaction.category,
//         account,
//         transaction.amount,
//         transaction.note || "",
//       ];

//       csvRows.push(
//         row
//           .map(
//             (value) =>
//               `"${String(value).replace(/"/g, '""')}"`
//           )
//           .join(",")
//       );
//     });

//     const csv = csvRows.join("\n");

//     res.setHeader(
//       "Content-Type",
//       "text/csv; charset=utf-8"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="expenseflow-transactions-${Date.now()}.csv"`
//     );

//     res.status(200).send(csv);
//   } catch (error) {
//     console.error(
//       "Export transactions CSV error:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to export transactions",
//     });
//   }
// };




import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { calculateNextOccurrence } from "../utils/recurringUtils.js";

// ======================================================
// CREATE TRANSACTION
// ======================================================
export const createTransaction = async (req, res) => {
  try {
    const {
      amount,
      type,
      category,
      accountId,
      note,
      date,
      isRecurring,
      recurringFrequency,
    } = req.body;

    // Basic validation
    if (!amount || !type || !category || !accountId) {
      return res.status(400).json({
        message: "Amount, type, category and account are required",
      });
    }

    if (!["Income", "Expense"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    if (isRecurring && !recurringFrequency) {
      return res.status(400).json({
        message:
          "Recurring frequency is required for recurring transactions",
      });
    }

    // Find account belonging to logged-in user
    const account = await Account.findOne({
      _id: accountId,
      userId: req.user._id,
      isActive: true,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Check expense balance BEFORE creating transaction
    if (type === "Expense") {
      const expenseAmount = Number(amount);

      if (account.balance < expenseAmount) {
        return res.status(400).json({
          message: `Insufficient balance. Available balance is ₹${account.balance.toFixed(
            2
          )}.`,
        });
      }
    }

    // Upload attachment to Cloudinary if file exists
    let attachmentUrl = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer
      );

      attachmentUrl = uploadResult.secure_url;
    }

    // Calculate recurring next occurrence
    const transactionDate = date || new Date();

    const calculatedNextOccurrence =
      isRecurring && recurringFrequency
        ? calculateNextOccurrence(
            transactionDate,
            recurringFrequency
          )
        : null;

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      accountId,
      amount: Number(amount),
      type,
      category: category.trim(),
      note: note?.trim() || "",
      date: transactionDate,
      attachment: attachmentUrl,
      isRecurring: Boolean(isRecurring),
      recurringFrequency:
        isRecurring && recurringFrequency
          ? recurringFrequency
          : null,
      nextOccurrence: calculatedNextOccurrence,
    });

    // Update account balance
    if (type === "Income") {
      account.balance += Number(amount);
    } else {
      account.balance -= Number(amount);
    }

    await account.save();

    // Populate account details
    const populatedTransaction =
      await Transaction.findById(transaction._id).populate(
        "accountId",
        "name type balance"
      );

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    res.status(500).json({
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};

// ======================================================
// GET TRANSACTIONS
// ======================================================
export const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      accountId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const pageLimit = Math.min(
      Math.max(Number(limit), 1),
      50
    );

    const filter = {
      userId: req.user._id,
      isActive: true,
    };

    // Type filter
    if (type && ["Income", "Expense"].includes(type)) {
      filter.type = type;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Account filter
    if (accountId) {
      filter.accountId = accountId;
    }

    // Date filter
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        filter.date.$lte = end;
      }
    }

    // Amount filter
    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    // Search
    if (search) {
      const searchRegex = new RegExp(search, "i");

      filter.$or = [
        {
          note: searchRegex,
        },
        {
          category: searchRegex,
        },
      ];
    }

    const skip =
      (currentPage - 1) * pageLimit;

    const [
      transactions,
      totalTransactions,
    ] = await Promise.all([
      Transaction.find(filter)
        .populate(
          "accountId",
          "name type balance"
        )
        .sort({
          date: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageLimit),

      Transaction.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalTransactions / pageLimit
    );

    res.status(200).json({
      transactions,
      pagination: {
        currentPage,
        pageLimit,
        totalTransactions,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE TRANSACTION
// ======================================================
export const getTransactionById = async (
  req,
  res
) => {
  try {
    const transaction =
      await Transaction.findOne({
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      }).populate(
        "accountId",
        "name type balance"
      );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      transaction,
    });
  } catch (error) {
    console.error(
      "Get transaction by ID error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch transaction",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE TRANSACTION
// ======================================================
// export const updateTransaction = async (
//   req,
//   res
// ) => {
//   try {
//     const transaction =
//       await Transaction.findOne({
//         _id: req.params.id,
//         userId: req.user._id,
//         isActive: true,
//       });

//     if (!transaction) {
//       return res.status(404).json({
//         message: "Transaction not found",
//       });
//     }

//     const oldAmount = transaction.amount;
//     const oldType = transaction.type;
//     const oldAccountId = transaction.accountId;

//     const {
//       amount,
//       type,
//       category,
//       accountId,
//       note,
//       date,
//       isRecurring,
//       recurringFrequency,
//     } = req.body;

//     // Determine new values
//     const newAmount =
//       amount !== undefined
//         ? Number(amount)
//         : oldAmount;

//     const newType =
//       type !== undefined
//         ? type
//         : oldType;

//     const newAccountId =
//       accountId || oldAccountId;

//     if (newAmount <= 0) {
//       return res.status(400).json({
//         message: "Amount must be greater than 0",
//       });
//     }

//     if (!["Income", "Expense"].includes(newType)) {
//       return res.status(400).json({
//         message: "Invalid transaction type",
//       });
//     }

//     // Verify new account belongs to user
//     const newAccount =
//       await Account.findOne({
//         _id: newAccountId,
//         userId: req.user._id,
//         isActive: true,
//       });

//     if (!newAccount) {
//       return res.status(404).json({
//         message: "Account not found",
//       });
//     }

//     // If recurring is enabled, frequency is required
//     const finalIsRecurring =
//       isRecurring !== undefined
//         ? Boolean(isRecurring)
//         : transaction.isRecurring;

//     const finalRecurringFrequency =
//       recurringFrequency !== undefined
//         ? recurringFrequency
//         : transaction.recurringFrequency;

//     if (
//       finalIsRecurring &&
//       !finalRecurringFrequency
//     ) {
//       return res.status(400).json({
//         message:
//           "Recurring frequency is required for recurring transactions",
//       });
//     }

//     // Find old account
//     const oldAccount =
//       await Account.findOne({
//         _id: oldAccountId,
//         userId: req.user._id,
//         isActive: true,
//       });

//     // --------------------------------------------------
//     // Revert old transaction effect
//     // --------------------------------------------------
//     if (oldAccount) {
//       if (oldType === "Income") {
//         oldAccount.balance -= oldAmount;
//       } else {
//         oldAccount.balance += oldAmount;
//       }

//       await oldAccount.save();
//     }

//     // --------------------------------------------------
//     // Check new expense balance
//     // --------------------------------------------------
//     if (newType === "Expense") {
//       if (newAccount.balance < newAmount) {
//         // Restore old account balance because we already
//         // reverted the old transaction
//         if (oldAccount) {
//           if (oldType === "Income") {
//             oldAccount.balance += oldAmount;
//           } else {
//             oldAccount.balance -= oldAmount;
//           }

//           await oldAccount.save();
//         }

//         return res.status(400).json({
//           message: `Insufficient balance. Available balance is ₹${newAccount.balance.toFixed(
//             2
//           )}.`,
//         });
//       }
//     }

//     // --------------------------------------------------
//     // Apply new transaction effect
//     // --------------------------------------------------
//     if (newType === "Income") {
//       newAccount.balance += newAmount;
//     } else {
//       newAccount.balance -= newAmount;
//     }

//     await newAccount.save();




//     let newAttachmentUrl = transaction.attachment;

// // Remove existing attachment if requested
// if (req.body.removeAttachment === "true") {
//   newAttachmentUrl = null;
// }

// // Upload new attachment if provided
// // New upload will override removal
// if (req.file) {
//   const uploadResult = await uploadToCloudinary(
//     req.file.buffer
//   );

//   newAttachmentUrl = uploadResult.secure_url;
// }

//     // --------------------------------------------------
//     // Update transaction fields
//     // --------------------------------------------------
//     transaction.amount = newAmount;
//     transaction.type = newType;

//     if (category !== undefined) {
//       transaction.category =
//         category.trim();
//     }

//     if (accountId !== undefined) {
//       transaction.accountId =
//         accountId;
//     }

//     if (note !== undefined) {
//       transaction.note =
//         note.trim();
//     }

//     if (date !== undefined) {
//       transaction.date = date;
//     }

//     transaction.attachment =
//       newAttachmentUrl;

//     transaction.isRecurring =
//       finalIsRecurring;

//     transaction.recurringFrequency =
//       finalIsRecurring
//         ? finalRecurringFrequency
//         : null;

//     // --------------------------------------------------
//     // Recurring next occurrence
//     // --------------------------------------------------
//     if (transaction.isRecurring) {
//       transaction.nextOccurrence =
//         calculateNextOccurrence(
//           transaction.date,
//           transaction.recurringFrequency
//         );
//     } else {
//       transaction.nextOccurrence = null;
//     }

//     await transaction.save();

//     // Populate updated transaction
//     const updatedTransaction =
//       await Transaction.findById(
//         transaction._id
//       ).populate(
//         "accountId",
//         "name type balance"
//       );

//     res.status(200).json({
//       message:
//         "Transaction updated successfully",
//       transaction: updatedTransaction,
//     });
//   } catch (error) {
//     console.error(
//       "Update transaction error:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to update transaction",
//       error: error.message,
//     });
//   }
// };



// ======================================================
// UPDATE TRANSACTION
// ======================================================
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const oldAmount = transaction.amount;
    const oldType = transaction.type;
    const oldAccountId = transaction.accountId;

    const {
      amount,
      type,
      category,
      accountId,
      note,
      date,
      isRecurring,
      recurringFrequency,
      removeAttachment,
    } = req.body;

    // --------------------------------------------------
    // Determine new values
    // --------------------------------------------------

    const newAmount =
      amount !== undefined
        ? Number(amount)
        : oldAmount;

    const newType =
      type !== undefined
        ? type
        : oldType;

    const newAccountId =
      accountId || oldAccountId;

    if (newAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    if (!["Income", "Expense"].includes(newType)) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    // --------------------------------------------------
    // Verify new account belongs to user
    // --------------------------------------------------

    const newAccount = await Account.findOne({
      _id: newAccountId,
      userId: req.user._id,
      isActive: true,
    });

    if (!newAccount) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // --------------------------------------------------
    // Recurring validation
    // --------------------------------------------------

    const finalIsRecurring =
      isRecurring !== undefined
        ? isRecurring === "true" ||
          isRecurring === true
        : transaction.isRecurring;

    const finalRecurringFrequency =
      recurringFrequency !== undefined
        ? recurringFrequency
        : transaction.recurringFrequency;

    if (
      finalIsRecurring &&
      !finalRecurringFrequency
    ) {
      return res.status(400).json({
        message:
          "Recurring frequency is required for recurring transactions",
      });
    }

    // --------------------------------------------------
    // Find old account
    // --------------------------------------------------

    const oldAccount = await Account.findOne({
      _id: oldAccountId,
      userId: req.user._id,
      isActive: true,
    });

    // --------------------------------------------------
    // Revert old transaction effect
    // --------------------------------------------------

    if (oldAccount) {
      if (oldType === "Income") {
        oldAccount.balance -= oldAmount;
      } else {
        oldAccount.balance += oldAmount;
      }

      await oldAccount.save();
    }

    // --------------------------------------------------
    // Check new expense balance
    // --------------------------------------------------

    if (newType === "Expense") {
      if (newAccount.balance < newAmount) {
        // Restore old account balance
        if (oldAccount) {
          if (oldType === "Income") {
            oldAccount.balance += oldAmount;
          } else {
            oldAccount.balance -= oldAmount;
          }

          await oldAccount.save();
        }

        return res.status(400).json({
          message: `Insufficient balance. Available balance is ₹${newAccount.balance.toFixed(
            2
          )}.`,
        });
      }
    }

    // --------------------------------------------------
    // Apply new transaction effect
    // --------------------------------------------------

    if (newType === "Income") {
      newAccount.balance += newAmount;
    } else {
      newAccount.balance -= newAmount;
    }

    await newAccount.save();

    // --------------------------------------------------
    // HANDLE ATTACHMENT
    // --------------------------------------------------

    let newAttachmentUrl =
      transaction.attachment || null;

    // Remove existing attachment
    if (removeAttachment === "true") {
      newAttachmentUrl = null;
    }

    // Upload new attachment
    // If a new file is uploaded,
    // it overrides the remove action.
    if (req.file) {
      const uploadResult =
        await uploadToCloudinary(
          req.file.buffer
        );

      newAttachmentUrl =
        uploadResult.secure_url;
    }

    // --------------------------------------------------
    // Update transaction fields
    // --------------------------------------------------

    transaction.amount = newAmount;
    transaction.type = newType;

    if (category !== undefined) {
      transaction.category =
        category.trim();
    }

    transaction.accountId =
      newAccountId;

    if (note !== undefined) {
      transaction.note =
        note.trim();
    }

    if (date !== undefined) {
      transaction.date = date;
    }

    // Save attachment
    transaction.attachment =
      newAttachmentUrl;

    // --------------------------------------------------
    // Recurring transaction
    // --------------------------------------------------

    transaction.isRecurring =
      finalIsRecurring;

    transaction.recurringFrequency =
      finalIsRecurring
        ? finalRecurringFrequency
        : null;

    if (transaction.isRecurring) {
      transaction.nextOccurrence =
        calculateNextOccurrence(
          transaction.date,
          transaction.recurringFrequency
        );
    } else {
      transaction.nextOccurrence = null;
    }

    // --------------------------------------------------
    // Save transaction
    // --------------------------------------------------

    await transaction.save();

    // --------------------------------------------------
    // Populate updated transaction
    // --------------------------------------------------

    const updatedTransaction =
      await Transaction.findById(
        transaction._id
      ).populate(
        "accountId",
        "name type balance"
      );

    res.status(200).json({
      message:
        "Transaction updated successfully",
      transaction:
        updatedTransaction,
    });
  } catch (error) {
    console.error(
      "Update transaction error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update transaction",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE TRANSACTION
// ======================================================
export const deleteTransaction = async (
  req,
  res
) => {
  try {
    const transaction =
      await Transaction.findOne({
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const account =
      await Account.findOne({
        _id: transaction.accountId,
        userId: req.user._id,
        isActive: true,
      });

    // Revert account balance
    if (account) {
      if (transaction.type === "Income") {
        account.balance -=
          transaction.amount;
      } else {
        account.balance +=
          transaction.amount;
      }

      await account.save();
    }

    transaction.isActive = false;

    await transaction.save();

    res.status(200).json({
      message:
        "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete transaction error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete transaction",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT TRANSACTIONS CSV
// ======================================================
export const exportTransactionsCSV = async (
  req,
  res
) => {
  try {
    const {
      type,
      category,
      accountId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
    } = req.query;

    const filter = {
      userId: req.user._id,
      isActive: true,
    };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (accountId) {
      filter.accountId = accountId;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte =
          new Date(
            `${startDate}T00:00:00`
          );
      }

      if (endDate) {
        filter.date.$lte =
          new Date(
            `${endDate}T23:59:59`
          );
      }
    }

    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte =
          Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte =
          Number(maxAmount);
      }
    }

    if (search) {
      filter.$or = [
        {
          note: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const transactions =
      await Transaction.find(filter)
        .populate(
          "accountId",
          "name"
        )
        .sort({
          date: -1,
        });

    const csvRows = [];

    csvRows.push(
      [
        "Date",
        "Type",
        "Category",
        "Account",
        "Amount",
        "Note",
      ]
        .map(
          (value) => `"${value}"`
        )
        .join(",")
    );

    transactions.forEach(
      (transaction) => {
        const date =
          new Date(
            transaction.date
          )
            .toISOString()
            .split("T")[0];

        const account =
          transaction.accountId?.name ||
          "Unknown";

        const row = [
          date,
          transaction.type,
          transaction.category,
          account,
          transaction.amount,
          transaction.note || "",
        ];

        csvRows.push(
          row
            .map(
              (value) =>
                `"${String(
                  value
                ).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        );
      }
    );

    const csv =
      csvRows.join("\n");

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="expenseflow-transactions-${Date.now()}.csv"`
    );

    res.status(200).send(csv);
  } catch (error) {
    console.error(
      "Export transactions CSV error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to export transactions",
    });
  }
};