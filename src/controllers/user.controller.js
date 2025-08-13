import cloudinary from "../config/cloudinaryConfig.js";
import catchAsync from "../middlewares/catchAsync.js";
import User from "../models/user.model.js";
import sendResponse from "../responses/sendResponse.js"; // Adjust the path as needed
import { getUserService, getAllUsersService, deleteUserService, updateProfileImageService, updateUserService } from "../services/user.service.js";

export const updateProfileImage = catchAsync(async (req, res) => {
    // console.log(req.file);

    const updateProfilePic = await updateProfileImageService(req.file.path)

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
export const updateUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const { name, username, bio, location, email } = req.body;

    console.log(req.body);
    

    const updatedUser = await updateUserService({ userId, userData: req.body })

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
export const deleteUser = catchAsync(async (req, res) => {
    const userId = req.user._id;

    const user = await deleteUserService(userId);

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
export const getUser = catchAsync(async (req, res) => {
    const userId = req.use._id;

    const user = await getUserService(userId);

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
export const getAllUsers = catchAsync(async (req, res) => {
    const users = await getAllUsersService(req.user._id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users found successfully!",
        data: users
    })
})