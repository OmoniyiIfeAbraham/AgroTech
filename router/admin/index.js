const express = require('express')
const router = express.Router()

const productsMod = require('./../../models/products/products')

router.get('/', async(req, res) => {
    const sess = req.session
    if(sess.email && sess.password && sess.identifier === 'admin') {
        const products = await productsMod.find({})
        res.render('admin/index', { msg: '', products })
    } else {
        res.redirect('/login')
    }
})

module.exports = router