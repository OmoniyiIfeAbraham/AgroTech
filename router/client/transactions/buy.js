const express = require("express");
const router = express.Router();

const buyMod = require("./../../../models/transactions/buy");

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.ref) {
    const ref = sess.ref;
    const person = await buyMod.findOne({ email: sess.email, ref: sess.ref });
    console.log(person);
    res.render("client/transactions/buy", { msg: "", person, ref });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
