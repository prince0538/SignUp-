const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    signUpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signUp',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['processing', 'success', 'failed', 'abandoned'],
        default: 'processing'
    },
}, { timestamps: true });

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = paymentModel;