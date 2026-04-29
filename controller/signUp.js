const signUpModel = require('../models/signUp');
const cloudinary = require('../middlewares/cloudinary');
const fs = require('fs');
const bcrypt = require('bcrypt')
const {brevo} = require('../utils/brevo')
const {emailTemplate, resetPasswordTemplate, resetPasswordSuccessfulTemplate } = require('../email')
const jwt = require('jsonwebtoken')


exports.signUp = async(req, res) => {
    try {

        const { Name, EmailAddress, PhoneNumber, Password } = req.body
        console.log(req.body)
        const signUp = await signUpModel.findOne({EmailAddress})
        console.log(signUp)
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

exports.forgetPassword = async(req, res) => {
    try {
        // extract the user email from the request body
        const { EmailAddress } = req.body
        // find user
        const signUp = await signUpModel.findOne({EmailAddress: EmailAddress.toLowerCase() });
        // check if user exits
        if(signUp === null){
            return res.status(404).json({
                message: 'Invalid credentials'
            })
        }
        // generate otp
        const otp = Math.round(Math.random() * 1e4)
        .toString()
        .padStart(4, '0');

        signUp.otp = otp
        signUp.otpExpires = Date.now() + ((1000 * 60 * 30));
        const data = {
            name: signUp.Name,
            otp: otp
        }
        brevo(signUp.EmailAddress, signUp.Name, resetPasswordTemplate(data))
        await signUp.save()
        res.status(200).json({
            message: 'OTP sent successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const { otp, Password, EmailAddress } = req.body;
        const signUp = await signUpModel.findOne({ EmailAddress: EmailAddress.toLowerCase() });

        if(signUp == null) {
            return res.status(404).json({
                message: 'Invaild credentials'
            })
        }
        console.log(Date.now() > signUp.otpExpires)
        
        console.log(signUp.otp)

        if(Date.now() > signUp.otpExpires || otp !== signUp.otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(Password, salt);
        signUp.Password = hashPassword
        await signUp.save();
        brevo(signUp.EmailAddress, signUp.Name, resetPasswordSuccessfulTemplate(signUp.Name))
        res.status(200).json({
            message: 'Password reset successful'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.changePassword = async(req, res) => {
    try {
        const { id } = req.signUp;

        const { oldPassword, newPassword } = req.body;

        const user = await userModel.findById(id);

        if(!signUp) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        const checkPassword = await bcrypt.compare(oldPassword, user.password);
        if(!checkPassword) {
            return res.status(400).json({
                message: 'Old password isinvalid'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword;
        await user.save()

        res.status(200).json({
            message: 'Password changed successfully'
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.loginWithGoogle = async (req, res) => {
    try {
        // console.log('User', req.user)
        const token = await jwt.sign({id: req.signUp._id, role: req.signUp.role}, process.env.JWT_SECRET, { expiresIn: '1d'});

        res.status(200).json({
            message: 'Login successfully',
            data: req.signUp.fullName,
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const signUp = await signUpModel.find()

        res.status(200).json({
            message: 'All users retrieved successfully',
            data: user
        })
    } catch (error) {
        console.log(error.message)
         res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        
        const { id } = req.params
        const signUp = await signUpModel.findByIdAndDelete(id);
        if (!signUp) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        res.status(200).json({
            message: 'User deleted successfully',
            data: users
        })
    } catch (error) {
        console.log(error.message)
         res.status(500).json({
            message: 'Something went wrong'
        })
    }
}