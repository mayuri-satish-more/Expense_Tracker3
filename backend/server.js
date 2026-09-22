import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import processRecurringTransactions from "./utils/processRecurringTransactions.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import savingsGoalRoutes from "./routes/savingsGoalRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// Database
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Body parser
app.use(express.json());

// app.use(mongoSanitize());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);




app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/budgets",
  budgetRoutes
);


app.use(
  "/api/savings-goals",
  savingsGoalRoutes
);


app.use("/api/categories", categoryRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running"
  });
});


const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    processRecurringTransactions();

    setInterval(
      processRecurringTransactions,
      60 * 1000
    );
  });
}

export default app;