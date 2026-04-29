const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    groupId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'groupInfo'
    },
    signUpId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'signUp'
    },
    groupName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    signUpInfo: {
        type: String,
        required: true
    }

}, { timestamps: true  });

const requestModel = mongoose.model('request', requestSchema);

module.exports = requestModel;