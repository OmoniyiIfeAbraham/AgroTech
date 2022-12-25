const express = require("express");

const router = express.Router();

// const http = require("http");
const https = require('https')
const buysMod = require('./../../../models/transactions/buy')
const productsMod = require('./../../../models/products/products')
const mailer = require('nodemailer')

const systemMail = mailer.createTransport({
  service: process.env.service,
  host: process.env.host,
  port: 465,
  auth: {
      user: process.env.email,
      pass: process.env.pass
  },
  tls: {
      rejectUnauthorized: false
  }
})

router.get("/", async(req, res, next) => {
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

    response.on("end", async() => {
      const info = JSON.parse(data)
      const reference = info.data.reference
      const amount = info.data.amount
      const buy = await buysMod.findOne({ ref: reference })
      const product = await productsMod.findById(buy.productID)
      const products = await productsMod.find({ category: product.category})
      if(buy.amount == amount/100 && product.price == amount/100) {
        buysMod.findOneAndUpdate({ ref: reference }, { confirmed: true }, (err, docs) => {
          if(err) {
            console.log(err)
            next(err)
          } else {
            async function mail() {
              const mailOption={
                from: `${process.env.adminName} ${process.env.email}`,
                to: buy.email,
                subject: `${buy.firstName} ${buy.lastName} Transaction Details`,
                html: `
                    <body>
                        <center><h3>Hello ${buy.firstName} ${buy.lastName} Your Payment Was Succesful and Your Good would be Delivered ASAP. </h3></center>
                    </body>
                `
              }
              await systemMail.sendMail(mailOption)
            }
            mail()
            if(product.category === 'livestock product') {
              res.render('client/products/livestockProducts', { products, msg: '', resp: `Your Payment Was Succesful and a mail with Details has been sent to this Address: ${buy.email}.`})
            } else {
              res.render('client/products/agriculturalProducts', { products, msg: '', resp: `Your Payment Was Succesful and a mail with Details has been sent to this Address: ${buy.email}.`})
            }
          }
        })
      } else {
        async function mail() {
          const mailOption={
            from: `${process.env.adminName} ${process.env.email}`,
            to: buy.email,
            subject: `${buy.firstName} ${buy.lastName} Transaction Details`,
            html: `
                <body>
                    <center><h3>Hello ${buy.firstName} ${buy.lastName} Your Payment Failed Because you Tampered with the Price of the Product. Sorry But There would be No Refund Of Fund and No Delivery of Good. </h3></center>
                </body>
            `
          }
          await systemMail.sendMail(mailOption)
        }
        mail()
        if(product.category === 'livestock product') {
          res.render('client/products/livestockProducts', { products, msg: '', resp: `Your Payment Failed due to Incorrect Price. Details has been sent to this Address: ${buy.email}.` })
        } else {
          res.render('client/products/agriculturalProducts', { products, msg: '', resp: `Your Payment Failed due to Incorrect Price. Details has been sent to this Address: ${buy.email}.` })
        }
      }
    });
  };

  let rep = https.request(options, callback);
  rep.end();
  console.log("call completed successfully");
});

module.exports = router;
