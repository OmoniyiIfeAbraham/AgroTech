const mongoose = require('mongoose')

const Schema = mongoose.Schema

const products = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    imagePublicId: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    snippet: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Products', products)