const joi = require('joi');

exports.signUpVaidator = (req, res, next) => {
    const schema = joi.object({
        Name: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': "Name is required",
            "string.empty": "Name cannot be empty",
            'string.pattern.base': "Name cannot contain numbers and must be at least 4 characters"
        }),
        EmailAddress: joi.string().email().required().messages({
            'any.required': "Email is required",
            "string.empty": "Email cannot be empty",
            'string.email': "Email must be a valid email"
        }),
        PhoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
            'any.required': "PhoneNumber is required",
            "string.empty": "PhoneNumber cannot be empty",
            'string.pattern.base': "PhoneNumber must only contain digits and must be 11 digits"
        }),
        Password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': "Password is required",
            "string.empty": "Password cannot be empty",
            'string.pattern.base': "Password must contain at least one lowercase letter, one uppercase letter, and be at least 8 characters long"
        })
    })

    const { error } = schema.validate(req.body);

    if(error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next();
}

exports.groupVlidator = (req, res, next) => {
    const schema = joi.object({
        groupName: joi.string().trim().pattern(/^[A-Za-z\s]{10,}$/).required().messages({
            'any.required': "Group Name is required",
            "string.empty": "Group Name cannot be empty",
            'string.pattern.base': "Group Name cannot contain numbers and must be at least 10 characters"
        }),
        members: joi.array().items().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
            'any.required': "Members are required",
            "array.empty": "Members cannot be empty",
            "array.base": "Members must be an array of user IDs",
        }),
        contributionAmount: joi.string().pattern(/^[0-9]+$/).required().messages({
            'any.required': "Contribution Amount is required",
            "string.empty": "Contribution Amount cannot be empty",
            'string.pattern.base': "Contribution Amount must only contain digits"
        }),
        contributionFrequecy: joi.string().valid('daily', 'weekly', 'monthly').required().messages({
            'any.required': "Contribution Frequency is required",
            "string.empty": "Contribution Frequency cannot be empty",
            'string.valid': "Contribution Frequency must be either 'daily', 'weekly', or 'monthly'"
        }),
        payoutFrequecy: joi.string().valid('daily', 'weekly', 'monthly').required().messages({
            'any.required': "Payout Frequency is required",
            "string.empty": "Payout Frequency cannot be empty",
            'string.valid': "Payout Frequency must be either 'daily', 'weekly', or 'monthly'"
        }),
        describeGroup: joi.string().trim().required().messages({
            'any.required': "Description is required",
            "string.empty": "Description cannot be empty"
        }),
        TotalMembers: joi.number().integer().min(1).required().messages({
            'any.required': "Total Members is required",
            "number.empty": "Total Members cannot be empty",
            "number.base": "Total Members must be a number"
        })
    })
    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next();
}

exports.resetPasswordValidator = (req, res, next) => {
    const schema = joi.object({
        EmailAddress: joi.string().email().required().messages({
            'any.required': "Email is required",
            "string.empty": "Email cannot be empty",
            'string.email': "Email must be a valid email"
        }),
        otp: joi.string().pattern(/^\d{6}$/).required().messages({
            'any.required': "OTP is required",
            "string.empty": "OTP cannot be empty",
            'string.pattern.base': "OTP must be a 6-digit number"
        }),
        Password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': "Password is required",
            "string.empty": "Password cannot be empty",
            'string.pattern.base': "Password must contain at least one lowercase letter, one uppercase letter, and be at least 8 characters long"
        }),
        confirmPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': "Password is required",
            "string.empty": "Password cannot be empty",
            'string.pattern.base': "Password must contain at least one lowercase letter, one uppercase letter, and be at least 8 characters long"
        })
    })
    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next();
}