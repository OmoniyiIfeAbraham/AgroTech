const express = require('express')

const router = express.Router()

const buyMod = require('./../../../models/transactions/buy')
const productsMod = require('./../../../models/products/products')
const transactionsMod = require('./../../../models/transactions/transactions')

router.post('/livestock', async(req, res, next) => {
    const sess = req.session
    const products = await productsMod.find({ category: 'livestock product'})
    try{
        const Email = req.body.email
        const Amount = req.body.amount
        const FirstName = req.body.firstName
        const LastName = req.body.lastName
        const Ref = req.body.ref
        const ProductID = req.body.product_id
        const product = await productsMod.findById(ProductID)
        if(Email != null && Amount != null && FirstName != null && LastName != null && Ref != null) {
            const check = await buyMod.findOne({ ref: Ref })
            if(!check) {
                const buy = new buyMod({
                    email: Email,
                    amount: Amount,
                    firstName: FirstName,
                    lastName: LastName,
                    ref: Ref,
                    productID: ProductID
                })
                await buy.save()
                const transaction = new transactionsMod({
                    email: Email,
                    amount: Amount,
                    fullName: `${FirstName} ${LastName}`,
                    productName: product.name
                })
                await transaction.save()
                sess.email = Email
                sess.ref = Ref
                res.redirect('/buy')
            } else {
                res.render('client/products/livestockProducts', { msg: 'A Transaction with this Reference Already Exists. Reload Page and Try Again Please!!!', products, resp: '' })
            }
        } else {
            res.render('client/products/livestockProducts', { msg: 'All Fields are Required!!!', products, resp: '' })
        }
    } catch(err) {
        console.log(err.message)
        res.render('client/products/livestockProducts', { msg: 'An Error Occurred!!!', products, resp: '' })
        next(err)
    }
})

router.post('/agricultural', async(req, res, next) => {
    const sess = req.session
    const products = await productsMod.find({ category: 'agricultural product'})
    try{
        const Email = req.body.email
        const Amount = req.body.amount
        const FirstName = req.body.firstName
        const LastName = req.body.lastName
        const Ref = req.body.ref
        const ProductID = req.body.product_id
        const product = await productsMod.findById(ProductID)
        if(Email != null && Amount != null && FirstName != null && LastName != null && Ref != null) {
            const check = await buyMod.findOne({ ref: Ref })
            if(!check) {
                const buy = new buyMod({
                    email: Email,
                    amount: Amount,
                    firstName: FirstName,
                    lastName: LastName,
                    ref: Ref,
                    productID: ProductID
                })
                await buy.save()
                const transaction = new transactionsMod({
                    email: Email,
                    amount: Amount,
                    fullName: `${FirstName} ${LastName}`,
                    productName: product.name
                })
                await transaction.save()
                sess.email = Email
                sess.ref = Ref
                res.redirect('/buy')
            } else {
                res.render('client/products/agriculturalProducts', { msg: 'A Transaction with this Reference Already Exists. Reload Page and Try Again Please!!!', products, resp: '' })
            }
        } else {
            res.render('client/products/agriculturalProducts', { msg: 'All Fields are Required!!!', products, resp: '' })
        }
    } catch(err) {
        console.log(err.message)
        res.render('client/products/agriculturalProducts', { msg: 'An Error Occurred!!!', products, resp: '' })
        next(err)
    }
})

module.exports = router