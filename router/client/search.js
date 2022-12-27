const express = require("express");

const router = express.Router();

const productsMod = require("./../../models/products/products");

router.post("/", async (req, res) => {
  const query = req.body.search;
  const results = await productsMod.find({ name: { $regex: query } });
  res.render("client/search", { results });
});

module.exports = router;
