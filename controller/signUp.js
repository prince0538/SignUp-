const signUpModel = require('../models/signUp');
const cloudinary = require('../middlewares/cloudinary');
const fs = require('fs');
const bcrypt = require('bcrypt')
const {brevo} = require('../utils/brevo')
const emailTemplate = require('../email')
const jwt = require('jsonwebtoken')


exports.signUp = async(req, res) => {
    try {

        const { Name, EmailAddress, PhoneNumber, Password } = req.body
        const signUp = await signUpModel.findOne({EmailAddress})
        if(signUp){
            return res.status(400).json({
                message: 'User already exists'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(Password, salt)
        const newSignUp = await signUpModel.create({
            Name,
            EmailAddress,
            PhoneNumber,
            Password: hashPassword,
            // profilePicture: extractSecureurl
        })
        brevo(newSignUp.EmailAddress, newSignUp.Name, emailTemplate(newSignUp.Name, newSignUp.otp))
        await newSignUp.save()
        res.status(201).json({
            message: 'SignUp created successfully',
            data: newSignUp
        })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

// exports.updatesignUp = async(req, res) => {
//     try {
        
//         const files = req.file
//         const filePath = files['path']

//         const uploadToCloudinary = await cloudinary.uploader.upload(filePath);
//         console.log(uploadToCloudinary)
//         const extractSecureurl = {secureUrl:uploadToCloudinary.secure_url, publicId: uploadToCloudinary.public_id}
//         console.log(extractSecureurl)
//         fs.unlinkSync(filePath)

//         const { id } = req.params

//         const updatesignUp = await signUpModel.findByIdAndUpdate(id, {
//             profilePicture: extractSecureurl
//         }, {new: true})

//         res.status(200).json({
//             message: 'Updated successfully',
//             data: updatesignUp
//         })

//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json({
//             message: 'Something went wrong'
//         })
//     }
// }

exports.verifyEmail = async(req, res) => {
    try {
        
        const { EmailAddress, otp } = req.body
        const signUp = await signUpModel.findOne({EmailAddress: EmailAddress})
        if(!signUp){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        if(signUp.otp !== otp){
            return res.status(400).json({
                message: 'Invalid OTP'
            })
        }
        if(Date.now() > signUp.otpExpires){
            return res.status(400).json({
                message: 'OTP has expired'
            })
        }
        signUp.isVerified = true
        await signUp.save()
        res.status(200).json({
            message: 'Email verified successfully',
            data: signUp
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.login = async(req, res) => {
    try {

        const { EmailAddress, Password }  = req.body;
        const signUp = await signUpModel.findOne({EmailAddress: EmailAddress})
        if (!signUp) {
           return res.status(404).json({
            message: 'Invalid credentials'
           }) 
        };

        const correctPassword = await bcrypt.compare(Password, signUp.Password)
        if (!correctPassword) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        };
        if(signUp.isVerified == false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        const token = jwt.sign({id: signUp._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        return res.status(200).json({
            message: 'Login successful',
            data: signUp,
            token
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}