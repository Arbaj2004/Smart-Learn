const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.updateUser = catchAsync(async (req, res, next) => {
    const updates = {
        profilePic: req.body.profilePic,
    };
    console.log(req.body);
    // Only allow specific fields to be updated
    console.log(req.user);
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true, // Return the updated document
        runValidators: true, // Validate updates against the schema
    });

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});