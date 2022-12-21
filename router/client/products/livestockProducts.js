const express = require('express')
const router = express.Router()

const productsMod = require('./../../../models/products/products')

router.get('/', async(req, res) => {
    const products = await productsMod.find({ category: 'livestock product'})
    res.render('client/products/livestockproducts', { products })
})

module.exports = router