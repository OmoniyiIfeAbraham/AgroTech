const express = require('express')
const router = express.Router()

const productsMod = require('./../../../models/products/products')

router.get('/', async(req, res) => {
    const products = await productsMod.find({ category: 'agricultural product'})
    res.render('client/products/agriculturalProducts', { products, msg: '', resp: '' })
})

module.exports = router