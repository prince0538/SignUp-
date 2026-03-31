const groupModel = require('../models/group');

exports.createGroup = async(req, res) => {
    
    try {
        
        const { groupName, contributionAmount, contributionFrequency, payoutAmount, describeGroup, TotalMembers} = req.body;
        const newGroup = await groupModel.create({
            groupName,
            contributionAmount,
            contributionFrequency,
            payoutAmount,
            describeGroup,
            TotalMembers,
            createdBy: req.signUp.id
        })
        await newGroup.save();
        res.status(201).json({
            message: 'Group created successfully',
            data: newGroup
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}