const express = require('express')
const router = express.Router()

const buyMod = require('./../../../models/transactions/buy')

router.get('/', async(req, res) => {
    const sess = req.session
    const ref = sess.ref
    const person = await buyMod.findOne({ email: sess.email })
    console.log(person)
    res.render('client/transactions/buy', { msg: '', person, ref })
})

module.exports = router