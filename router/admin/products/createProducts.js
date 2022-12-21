const express = require('express')
const router = express.Router()

const cloudinary = require('cloudinary')
const productsMod = require('./../../../models/products/products')

router.get('/', (req, res) => {
    const sess = req.session
    if(sess.email && sess.password && sess.identifier === 'admin') {
        res.redirect('/admin')
    } else {
        res.redirect('/login')
    }
})

router.post('/', async(req, res, next) => {
    const sess = req.session
    try {
        if(sess.email && sess.password && sess.identifier === 'admin') {
            const productName = req.body.name
            const productPrice = req.body.price
            const productContent = req.body.content
            const productCategory = req.body.category
            const products = await productsMod.find({})
            if(productName != null && productPrice != null && productContent != null && productCategory != null) {
                const match = await productsMod.findOne({ name: productName })
                if(!match) {
                    if(productContent.length > 30) {
                        const productImage = req.files.image
                        if(productImage.mimetype=='image/apng' || productImage.mimetype=='image/avif' || productImage.mimetype=='image/gif' || productImage.mimetype=='image/jpeg' || productImage.mimetype=='image/png' || productImage.mimetype=='image/svg+xml' || productImage.mimetype=='image/webp') {
                            const upload = await cloudinary.v2.uploader.upload(productImage.tempFilePath, { resource_type: 'image', folder: process.env.productImageFolder, use_filename: false, unique_filename: true })
                            const product = new productsMod({
                                name: productName,
                                image: upload.secure_url,
                                imagePublicId: upload.public_id,
                                price: productPrice,
                                content: productContent,
                                snippet: productContent.slice(0, 30),
                                category: productCategory
                            })
                            await product.save()
                            res.redirect('/admin')
                        } else {
                            res.render('admin/index', { msg: 'Invalid Image File Type', products })
                        }
                    } else {
                        res.render('admin/index', { msg: 'Product Content Description length must be Greater than Thirty(30) Characters', products })
                    }
                } else {
                    res.render('admin/index', { msg: 'A Product with that name Already Exists', products })
                }
            } else {
                res.render('admin/index', { msg: 'All Fields are Required!!!', products })
            }
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
        res.render('admin/index', { msg: 'An Error Occured!!!', products })
        next(error)
    }
})

module.exports = router