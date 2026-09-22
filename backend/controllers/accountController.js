import Account from "../models/Account.js";

// Create Account
export const createAccount = async (req, res) => {
  try {
    const { name, type, balance, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Account name and type are required",
      });
    }

    const existingAccount = await Account.findOne({
      userId: req.user._id,
      name: name.trim(),
    });

    if (existingAccount) {
      return res.status(409).json({
        message: "An account with this name already exists",
      });
    }

    const account = await Account.create({
      userId: req.user._id,
      name: name.trim(),
      type,
      balance: balance || 0,
      color: color || "#6366f1",
      icon: icon || "wallet",
    });

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create account",
      error: error.message,
    });
  }
};

// Get all accounts of logged-in user
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({
      userId: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    const totalBalance = accounts.reduce(
      (total, account) => total + account.balance,
      0
    );

    res.status(200).json({
      accounts,
      totalBalance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch accounts",
      error: error.message,
    });
  }
};

// Get single account
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.status(200).json({
      account,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch account",
      error: error.message,
    });
  }
};

// Update account
export const updateAccount = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;

    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (name !== undefined) {
      account.name = name.trim();
    }

    if (type !== undefined) {
      account.type = type;
    }

    if (color !== undefined) {
      account.color = color;
    }

    if (icon !== undefined) {
      account.icon = icon;
    }

    await account.save();

    res.status(200).json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update account",
      error: error.message,
    });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    account.isActive = false;

    await account.save();

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete account",
      error: error.message,
    });
  }
};