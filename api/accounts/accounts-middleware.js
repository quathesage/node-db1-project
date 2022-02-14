const db = require("../../data/db-config");
const Accounts = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  const error = { status: 400 };
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    error.message = { message: "name and budget are required" };
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    error.message = { message: "name of account must be between 3 and 100" };
  } else if (typeof budget !== "number" || isNaN(budget)) {
    error.message = { message: "budget of account must be a number" };
  } else if (budget < 0 || budget > 1000000) {
    error.message = { message: "budget of account is too large or too small" };
  }
  if (error.message) {
    next(error);
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const name = await db("accounts")
      .where("name", req.body.name.trim())
      .first();
    if (name) {
      res.status(400).json({ message: "that name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next({ message: err.message });
  }
};

exports.checkAccountId = async (req, res, next) => {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const account = await Accounts.getById(id);
    if (!account) {
      res.status(404).json({ message: "account not found" });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};
