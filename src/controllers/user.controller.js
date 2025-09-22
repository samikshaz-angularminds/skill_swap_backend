import cloudinary from "../config/cloudinaryConfig.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../responses/sendResponse.js"; // Adjust the path as needed
import userService from "../services/user.service.js";

const updateProfileImageController = catchAsync(async (req, res) => {
    // console.log(req.file);

    console.log("req.file: ", req.file);


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
const updateUserController = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const { name, username, bio, location, email } = req.body;

    console.log(req.body);


    const updatedUser = await userService.updateUserService({ userId: req.user._id, userData: req.body })

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
const deleteUserController = catchAsync(async (req, res) => {
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
const getUserController = catchAsync(async (req, res) => {
    const userId = req.user._id;

    // console.log("req.user._id: ",userId);


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
        data: user
    })
})

// get all users
const getAllUsersController = catchAsync(async (req, res) => {
    // console.log("req.uer--> ",req.user);

    const users = await userService.getAllUsersService(req.user._id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users found successfully!",
        data: users
    })
})

const getOneUserController = catchAsync(async (req, res) => {
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


const updateAvailabilityController = catchAsync(async (req, res) => {
    const requestBody = req.body;
    const userId = req.params.id;

    const updatedAvailability = await userService.updateAvailabilityService({ userId, availabilityData: requestBody });

    return sendResponse(res, {
        data: updatedAvailability,
        message: "update availability of user",
        success: true
    })

})

export default {
    updateProfileImageController,
    updateUserController,
    deleteUserController,
    getUserController,
    getAllUsersController,
    getOneUserController,
    updateAvailabilityController
}