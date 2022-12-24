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
      Authorization: "Bearer sk_test_a57c0c5dc61de74ba280e8601ccd83084c63fe20",
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
