const express = require("express");

const router = express.Router();

const messageMod = require("./../../models/messages/messages");

router.post("/", async (req, res, next) => {
  try {
    const Name = req.body.name;
    const Phone = req.body.phone;
    const Email = req.body.email;
    const Message = req.body.message;
    if (Name != null && Phone != null && Email != null && Message != null) {
      const message = new messageMod({
        name: Name,
        phone: Phone,
        email: Email,
        message: Message,
      });
      await message.save();
      res.redirect("/");
    } else {
      console.log("They must not be Null");
      next();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
