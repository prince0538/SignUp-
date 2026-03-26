const signUpModel = require('../models/signUp');
const cloudinary = require('../middlewares/cloudinary');
const fs = require('fs');
const bcrypt = require('bcrypt')


exports.signUp = async(req, res) => {
    try {

        // const files = req.file
        // const filePath = files['path']

        // const uploadToCloudinary = await cloudinary.uploader.upload(filePath);
        // console.log(uploadToCloudinary)
        // const extractSecureurl = {secureUrl:uploadToCloudinary.secure_url, publicId: uploadToCloudinary.public_id}
        // console.log(extractSecureurl)
        // fs.unlinkSync(filePath)

        const { Name, EmailAddress, PhoneNumber, Password } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(Password, salt)
        const newSignUp = await signUpModel.create({
            Name,
            EmailAddress,
            PhoneNumber,
            Password: hashPassword,
            // profilePicture: extractSecureurl
        })
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

exports.updatesignUp = async(req, res) => {
    try {
        
        const files = req.file
        const filePath = files['path']

        const uploadToCloudinary = await cloudinary.uploader.upload(filePath);
        console.log(uploadToCloudinary)
        const extractSecureurl = {secureUrl:uploadToCloudinary.secure_url, publicId: uploadToCloudinary.public_id}
        console.log(extractSecureurl)
        fs.unlinkSync(filePath)

        const { id } = req.params

        const updatesignUp = await signUpModel.findByIdAndUpdate(id, {
            profilePicture: extractSecureurl
        }, {new: true})

        res.status(200).json({
            message: 'SignUp updated successfully',
            data: updatesignUp
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}