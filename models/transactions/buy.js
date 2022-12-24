const mongoose = require('mongoose')

const Schema = mongoose.Schema

const buy = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    ref: {
        type: String,
        required: true,
        trim: true
    },
    productID: {
        type: String,
        required: true,
        trim: true,
    },
    confirmed: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Buy', buy)