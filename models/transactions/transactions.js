const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Transactions = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Transactions', Transactions)