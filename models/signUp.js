const mongoose = require('mongoose');

const signUpShema = new mongoose .Schema({
    Name: {
        type: String,
        require: true,
        trim: true
    },
    EmailAddress: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    PhoneNumber: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        require: true,
        trim: true
    },
    otp: {
        type: String,
        trim: true,
        default: () => {
            return Math.round(Math.random() * 1e4)
            .toString()
            .padStart(4, '0');
        },
    },
    profilePicture: {
        secureUrl: {
            type: String,
            require: true,
            trim: true
        },
        publicId: {
            type: String,
            require: true,
            trim: true
        }
    }
})

const signUpModel = mongoose.model('signUp', signUpShema)

module.exports = signUpModel