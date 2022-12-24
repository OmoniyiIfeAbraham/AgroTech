const express = require("express");

const router = express.Router();

// const http = require("http");
const https = require('https')

router.get("/", (req, res) => {
    const reference = req.query.reference
  var data = "";

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: process.env.secret_key,
    },
  };

  callback = (response) => {
    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      console.log(JSON.parse(data))
    });
  };

  let rep = https.request(options, callback);
  rep.end();
  res.send("call completed successfully");
});

module.exports = router;
