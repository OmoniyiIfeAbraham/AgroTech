const express = require("express");
const router = express.Router();

const productsMod = require("./../../models/products/products");

router.get("/", (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.redirect("/admin");
  } else {
    res.render("admin/login", { msg: "" });
  }
});

router.post("/", async (req, res) => {
  const sess = req.session;
  const adminEmail = process.env.adminEmail;
  const adminPassword = process.env.adminPassword;
  const email = req.body.email;
  const password = req.body.password;
  if (email != adminEmail) {
    res.render("admin/login", { msg: "Email is Incorrect" });
  } else if (password.length < 6) {
    res.render("admin/login", {
      msg: "Password must be six(6) or more characters long",
    });
  } else if (password != adminPassword) {
    res.render("admin/login", { msg: "Password is Incorrect" });
  } else {
    sess.email = email;
    sess.password = password;
    sess.identifier = process.env.identifier;
    const products = await productsMod.find({});
    res.render("admin/index", { msg: "", products });
  }
});

module.exports = router;
