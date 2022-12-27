const express = require("express");

const router = express.Router();

const transactionsMod = require("./../../../models/transactions/transactions");
const messagesMod = require("./../../../models/messages/messages");

router.get("/", async (req, res) => {
  const transactions = await transactionsMod.find();
  const messages = await messagesMod.find();
  res.render("admin/transactions/viewTransactions", { transactions, messages });
});

module.exports = router;
