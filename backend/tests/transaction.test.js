import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";

const app = express();

app.use(express.json());

// Fake users
const user1 = {
  _id: "user111111111111111111111",
};

const user2 = {
  _id: "user222222222222222222222",
};

// Fake transactions
let transactions = [];


// Fake authentication middleware
const testAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token === "Bearer user1") {
    req.user = user1;
  } else if (token === "Bearer user2") {
    req.user = user2;
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  next();
};


// CREATE transaction
app.post("/api/transactions", testAuth, (req, res) => {
  const transaction = {
    _id: `transaction${transactions.length + 1}`,
    userId: req.user._id,
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    note: req.body.note || "",
  };

  transactions.push(transaction);

  res.status(201).json({
    success: true,
    transaction,
  });
});


// GET transactions
app.get("/api/transactions", testAuth, (req, res) => {
  const userTransactions = transactions.filter(
    (transaction) =>
      transaction.userId === req.user._id
  );

  res.status(200).json({
    success: true,
    transactions: userTransactions,
  });
});


// UPDATE transaction
app.put(
  "/api/transactions/:id",
  testAuth,
  (req, res) => {
    const transaction = transactions.find(
      (item) =>
        item._id === req.params.id &&
        item.userId === req.user._id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    Object.assign(transaction, req.body);

    res.status(200).json({
      success: true,
      transaction,
    });
  }
);


// DELETE transaction
app.delete(
  "/api/transactions/:id",
  testAuth,
  (req, res) => {
    const transaction = transactions.find(
      (item) =>
        item._id === req.params.id &&
        item.userId === req.user._id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    transactions = transactions.filter(
      (item) => item._id !== req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  }
);


describe("Transaction API", () => {

  beforeEach(() => {
    transactions = [];
  });


  test("should create a transaction", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", "Bearer user1")
      .send({
        amount: 500,
        type: "Expense",
        category: "Food",
        note: "Test food expense",
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.transaction).toBeDefined();

    expect(response.body.transaction.amount).toBe(500);

    expect(response.body.transaction.category).toBe(
      "Food"
    );
  });


  test("should get user's transactions", async () => {

    await request(app)
      .post("/api/transactions")
      .set("Authorization", "Bearer user1")
      .send({
        amount: 500,
        type: "Expense",
        category: "Food",
      });

    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", "Bearer user1");

    expect(response.statusCode).toBe(200);

    expect(response.body.transactions).toHaveLength(1);
  });


  test("should update a transaction", async () => {

    const createResponse = await request(app)
      .post("/api/transactions")
      .set("Authorization", "Bearer user1")
      .send({
        amount: 500,
        type: "Expense",
        category: "Food",
      });

    const transactionId =
      createResponse.body.transaction._id;

    const response = await request(app)
      .put(`/api/transactions/${transactionId}`)
      .set("Authorization", "Bearer user1")
      .send({
        amount: 700,
        category: "Shopping",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.transaction.amount).toBe(700);

    expect(response.body.transaction.category).toBe(
      "Shopping"
    );
  });


  test("should prevent another user from accessing the transaction", async () => {

    const createResponse = await request(app)
      .post("/api/transactions")
      .set("Authorization", "Bearer user1")
      .send({
        amount: 500,
        type: "Expense",
        category: "Food",
      });

    const transactionId =
      createResponse.body.transaction._id;

    const response = await request(app)
      .get(`/api/transactions/${transactionId}`)
      .set("Authorization", "Bearer user2");

    expect(response.statusCode).toBe(404);
  });


  test("should delete a transaction", async () => {

    const createResponse = await request(app)
      .post("/api/transactions")
      .set("Authorization", "Bearer user1")
      .send({
        amount: 500,
        type: "Expense",
        category: "Food",
      });

    const transactionId =
      createResponse.body.transaction._id;

    const response = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", "Bearer user1");

    expect(response.statusCode).toBe(200);
  });

});