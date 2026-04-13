const groupModel = require('../models/group');

exports.createGroup = async(req, res) => {
    
    try {
        // console.log(req.signUp.id)
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
        newGroup.members.push(req.signUp.id);
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

exports.getAll = async(req, res) => {
    try {
        const allGroups = await groupModel.find().populate('members', 'fullname');
        res.status(200).json({
            message: 'Groups retrieved successfully',
            data: allGroups
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.getOneGroup = async(req, res) => {
    try {
        const group = await groupModel.findById(req.params.id).populate('Name', 'members', 'describeGroup');
        if(!group) {
            return res.status(404).json({
                message: 'Group not found'
            })
        }
        res.status(200).json({
            message: 'Group retrieved successfully',
            data: group
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}