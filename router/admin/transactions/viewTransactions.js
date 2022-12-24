const express = require('express')

const router = express.Router()

const transactionsMod = require('./../../../models/transactions/transactions')

router.get('/', async(req, res) => {
    const transactions = await transactionsMod.find()
    res.render('admin/transactions/viewTransactions', { transactions })
})

module.exports = router