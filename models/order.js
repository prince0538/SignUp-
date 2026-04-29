const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderName: {
        type: String,
        required: true
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signUp',
        required: true
    },
    orderAmount: {
        type: Number,
        required: true
    },
    orderDescription: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
}, {timestamp: true})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order