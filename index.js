const express = require("express");
const app = express();

// dotenv
require("dotenv").config();

const PORT = process.env.PORT;

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// morgan
app.use(require("morgan")("dev"));

// express-session
app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 568036800 },
  })
);

// express-fileupload
app.use(require("express-fileupload")({ useTempFiles: true }));

// mongoose
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.mongo_link, {
    useUnifiedTopology: true,
    useNewurlParser: true,
  })
  .then((res) => {
    if (res) {
      console.log("Database Connected Succesfully");
      app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`));
    } else {
      console.log("Database not Connected");
    }
  });

// templating
app.set("view engine", "ejs");
app.use(express.static("public"));

// ROUTES
// Admin
app.use('/admin', require('./router/admin/index')) //Admin Dashboard
app.use('/login', require('./router/admin/login')) // Admin Login
app.use('/addProduct', require('./router/admin/products/createProducts')) // Add Products
app.use('/updateProduct', require('./router/admin/products/updateProducts')) // Edit Products
app.use('/deleteProduct', require('./router/admin/products/deleteProducts')) // Delete Products
app.use('/verify_transaction', require('./router/admin/transactions/verifyTransaction')) // Verify Transaction

// Client
app.use('/', require('./router/client/index')) // Home Page
app.use('/agriculturalProducts', require('./router/client/products/agriculturalProducts')) // All Agricultural Products
app.use('/livestockProducts', require('./router/client/products/livestockProducts')) // All Livestock Products
app.use('/buy', require('./router/client/transactions/buy')) // Buy Form From PayStack
app.use('/regbuy', require('./router/client/transactions/regbuy')) // Register To Process Buy