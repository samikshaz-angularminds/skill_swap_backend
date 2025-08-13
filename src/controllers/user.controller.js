import cloudinary from "../config/cloudinaryConfig.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../responses/sendResponse.js"; // Adjust the path as needed
import userService from "../services/user.service.js";

const updateProfileImage = catchAsync(async (req, res) => {
    // console.log(req.file);

    const updateProfilePic = await userService.updateProfileImageService(req.file.path)

    // console.log("updateProfilePic-- ", updateProfilePic);

    if (!updateProfilePic) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }

    sendResponse(res, {
        statusCode: 200,
        message: "User updated successfully",
        data: updateProfilePic,
        success: true
    });
})

// Update User
const updateUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const { name, username, bio, location, email } = req.body;

    console.log(req.body);


    const updatedUser = await userService.updateUserService({ userId, userData: req.body })

    if (!updatedUser) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }

    sendResponse(res, {
        message: "User updated successfully",
        data: updatedUser,
    });
});

// Delete User
const deleteUser = catchAsync(async (req, res) => {
    const userId = req.user._id;

    const user = await userService.deleteUserService(userId);

    if (!user) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }

    // Optional: delete image from Cloudinary
    if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    sendResponse(res, {
        message: "User deleted successfully",
        success: true
    });
});

// get logged in user
const getUser = catchAsync(async (req, res) => {
    const userId = req.use._id;

    const user = await userService.getUserService(userId);

    if (!user) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User found successfully",
    })
})

// get all users
const getAllUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsersService(req.user._id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users found successfully!",
        data: users
    })
})

const getOneUser = catchAsync(async (req, res) => {
    const userId = req.params.id;

    const user = await userService.getOneUserService(userId);

    if (!user) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User found successfully",
        data: user
    });
})

export default {
    updateProfileImage,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    getOneUser
}