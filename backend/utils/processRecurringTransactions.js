
// import Transaction from "../models/Transaction.js";
// import Account from "../models/Account.js";
// import {
//   calculateNextOccurrence,
// } from "./recurringUtils.js";


// const processRecurringTransactions = async () => {
//   try {
//     const now = new Date();

//     const recurringTransactions =
//       await Transaction.find({
//         isRecurring: true,
//         isActive: true,
//         nextOccurrence: {
//           $lte: now,
//         },
//       });

//     for (const transaction of recurringTransactions) {

//       const account = await Account.findOne({
//         _id: transaction.accountId,
//         userId: transaction.userId,
//       });

//       if (!account) {
//         continue;
//       }


//       // ==============================
//       // CHECK BALANCE FOR EXPENSE
//       // ==============================

//       if (
//         transaction.type === "Expense" &&
//         account.balance < transaction.amount
//       ) {
//         // Keep it active, but don't create
//         // the transaction until sufficient
//         // balance is available.
//         continue;
//       }


//       // ==============================
//       // UPDATE ACCOUNT BALANCE
//       // ==============================

//       if (transaction.type === "Income") {

//         account.balance += transaction.amount;

//       } else {

//         account.balance -= transaction.amount;

//       }

//       await account.save();


//       // ==============================
//       // CREATE NEXT TRANSACTION
//       // ==============================

//       const nextTransaction =
//         await Transaction.create({
//           userId: transaction.userId,

//           accountId: transaction.accountId,

//           amount: transaction.amount,

//           type: transaction.type,

//           category: transaction.category,

//           note: transaction.note,

//           date: transaction.nextOccurrence,

//           attachment: transaction.attachment,

//           isRecurring: true,

//           recurringFrequency:
//             transaction.recurringFrequency,

//           nextOccurrence:
//             calculateNextOccurrence(
//               transaction.nextOccurrence,
//               transaction.recurringFrequency
//             ),

//           isActive: true,
//         });


//       // ==============================
//       // UPDATE ORIGINAL
//       // ==============================

//       transaction.isRecurring = false;
//       transaction.isActive = false;

//       await transaction.save();

//       console.log(
//         `Recurring transaction processed: ${nextTransaction._id}`
//       );
//     }

//   } catch (error) {

//     console.error(
//       "Recurring transaction processing error:",
//       error.message
//     );

//   }
// };


// export default processRecurringTransactions;



import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import {
  calculateNextOccurrence,
} from "./recurringUtils.js";

const processRecurringTransactions = async () => {
  try {
    const now = new Date();

    const recurringTransactions =
      await Transaction.find({
        isRecurring: true,
        isActive: true,
        nextOccurrence: {
          $lte: now,
        },
      });

    for (const transaction of recurringTransactions) {
      const account = await Account.findOne({
        _id: transaction.accountId,
        userId: transaction.userId,
      });

      if (!account) {
        continue;
      }

      // Don't process expense if balance is insufficient
      if (
        transaction.type === "Expense" &&
        account.balance < transaction.amount
      ) {
        continue;
      }

      // Update account balance
      if (transaction.type === "Income") {
        account.balance += transaction.amount;
      } else {
        account.balance -= transaction.amount;
      }

      await account.save();

      // Create next transaction
      const nextTransaction =
        await Transaction.create({
          userId: transaction.userId,
          accountId: transaction.accountId,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          note: transaction.note,
          date: transaction.nextOccurrence,
          attachment: transaction.attachment,
          isRecurring: true,
          recurringFrequency:
            transaction.recurringFrequency,
          nextOccurrence:
            calculateNextOccurrence(
              transaction.nextOccurrence,
              transaction.recurringFrequency
            ),
          isActive: true,
        });

      // Deactivate current occurrence
      transaction.isRecurring = false;
      transaction.isActive = false;

      await transaction.save();

      console.log(
        `Recurring transaction processed: ${nextTransaction._id}`
      );
    }
  } catch (error) {
    console.error(
      "Recurring transaction processing error:",
      error.message
    );
  }
};

export default processRecurringTransactions;