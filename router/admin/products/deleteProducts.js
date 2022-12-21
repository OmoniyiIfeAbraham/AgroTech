const express = require('express')
const router = express.Router()

const productsMod = require('./../../../models/products/products')
const cloudinary = require('cloudinary')

router.get('/:id', async(req, res, next) => {
    const sess = req.session
    const products = await productsMod.find({})
    try {
        if(sess.email && sess.password && sess.identifier === 'admin') {
            const id = req.params.id
            const product = await productsMod.findById(id)
            const { result } = await cloudinary.v2.uploader.destroy(product.imagePublicId)
            console.log(result)
            if(result !== "ok") {
                res.render('admin/index', { msg: 'Unable to Delete Succesfully!!!', products })
            } else {
                productsMod.findByIdAndDelete({ _id: id }, (err, docs) => {
                    if(err) {
                        console.log(err)
                        next(err)
                    } else {
                        res.redirect('/admin')
                    }
                })
            }
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
        res.render('admin/index', { msg: 'An Error Occurred!!!', products })
        next(error)
    }
})

module.exports = router