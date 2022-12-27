const express = require("express");
const router = express.Router();

const productsMod = require("./../../models/products/products");

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.redirect("/admin");
  } else {
    const products = await productsMod.find({}).limit(3);
    res.render("client/index", { products, msg: "" });
  }
});

module.exports = router;
