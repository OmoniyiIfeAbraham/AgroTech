const express = require('express')
const router = express.Router()

const buyMod = require('./../../../models/transactions/buy')

router.get('/', (req, res) => {
    res.render('client/transactions/buy', { msg: '' })
})

router.post('/', async(req, res, next) => {
    try{
        const Email = req.body.email
        const Amount = req.body.amount
        const FirstName = req.body.firstName
        const LastName = req.body.lastName
        const Ref = req.body.ref
        if(Email != null && Amount != null && FirstName != null && LastName != null && Ref != null) {
            const check = await buyMod.findOne({ ref: Ref })
            if(!check) {
                const buy = new buyMod({
                    email: Email,
                    amount: Amount,
                    firstName: FirstName,
                    lastName: LastName,
                    ref: Ref
                })
                await buy.save()
                res.redirect('/buy')
            } else {
                res.render('client/transactions/buy', { msg: 'A Transaction with this Reference Already Exists. Reload Page and Try Again Please!!!'})
            }
        } else {
            res.render('client/transactions/buy', { msg: 'All Fields are Required!!!'})
        }
    } catch(err) {
        console.log(err.message)
        res.render('client/transactions/buy', { msg: 'An Error Occurred!!!'})
        next(err)
    }
})

module.exports = router