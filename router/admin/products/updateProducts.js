const express = require("express");
const router = express.Router();

const productsMod = require("./../../../models/products/products");
const cloudinary = require("cloudinary");

router.get("/:id", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const id = req.params.id;
    const product = await productsMod.findById(id);
    res.render("admin/products/updateProduct", { product, msg: "" });
  } else {
    res.redirect("/login");
  }
});

router.post("/:id", async (req, res, next) => {
  const sess = req.session;
  const id = req.params.id;
  const product = await productsMod.findById(id);
  try {
    if (sess.email && sess.password && sess.identifier === "admin") {
      const productName = req.body.name;
      const productPrice = req.body.price;
      const productContent = req.body.content;
      const productCategory = req.body.category;
      if (
        productName != null &&
        productPrice != null && 
        productContent != null &&
        productCategory != null
      ) {
        if (productContent.length > 30) {
          const productImage = req.files?.image;
          if (productImage != null) {
            if (
              productImage.mimetype == "image/apng" ||
              productImage.mimetype == "image/avif" ||
              productImage.mimetype == "image/gif" ||
              productImage.mimetype == "image/jpeg" ||
              productImage.mimetype == "image/png" ||
              productImage.mimetype == "image/svg+xml" ||
              productImage.mimetype == "image/webp"
            ) {
              const { result } = await cloudinary.v2.uploader.destroy(
                product.imagePublicId
              );
              console.log(result);
              if (result !== "ok") {
                res.render("admin/products/updateProduct", {
                  product,
                  msg: "Unable to Update Succesfully!!!",
                });
              } else {
                async function Cloud() {
                  const upload = await cloudinary.v2.uploader.upload(
                    productImage.tempFilePath,
                    {
                      resource_type: "image",
                      folder: process.env.productImageFolder,
                      use_filename: false,
                      unique_filename: true,
                    }
                  );
                  productsMod.findByIdAndUpdate(
                    { _id: id },
                    {
                      name: productName,
                      image: upload.secure_url,
                      imagePublicId: upload.public_id,
                      price: productPrice,
                      content: productContent,
                      snippet: productContent.slice(0, 30),
                      category: productCategory,
                    },
                    (err, docs) => {
                      if (err) {
                        console.log(err);
                        next(err);
                      } else {
                        res.redirect("/admin");
                      }
                    }
                  );
                }
                Cloud();
              }
            } else {
              res.render("admin/products/updateProduct", {
                product,
                msg: "Invalid Image File type!!!",
              });
            }
          } else {
            productsMod.findByIdAndUpdate(
              { _id: id },
              {
                name: productName,
                price: productPrice,
                content: productContent,
                snippet: productContent.slice(0, 30),
                category: productCategory,
              },
              (err, docs) => {
                if (err) {
                  console.log(err);
                  next(err);
                } else {
                  res.redirect("/admin");
                }
              }
            );
          }
        } else {
          res.render("admin/products/updateProduct", {
            product,
            msg: "Product Content Description length must be Greater than Thirty(30) Characters",
          });
        }
      } else {
        res.render("admin/products/updateProduct", {
          product,
          msg: "Please fill all fields",
        });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
    res.render("admin/products/updateProduct", {
      product,
      msg: "An Error Ocurred!!!",
    });
    next(error);
  }
});

module.exports = router;
