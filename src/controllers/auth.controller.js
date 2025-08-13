import { v4 as uuidv4 } from "uuid";
import { envConfig } from "../config/envConfig.js";
import authService from "../services/auth.service.js"
import catchAsync from "../middlewares/catchAsync.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendResponse from "../responses/sendResponse.js"
import ApiError from "../errors/ApiError.js";

let refreshTokens = [];

const REFRESH_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict',
    path: '/refresh-token'
}

// Register New User
const userSignUp = catchAsync(async (req, res) => {

    const signUpUser = await authService.userSignUpService({ ...req.body });

    sendResponse(res,
        {
            statusCode: 201,
            message: "User created successfully",
            data: { userId: signUpUser._id },
        });
});

// Login User
const userLogin = catchAsync(async (req, res) => {

    const user = await authService.userLoginService(...req.body)


    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    // console.log("access token-- ",accessToken);
    // console.log("refresh token-- ",refreshToken);

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return sendResponse(res, {
        statusCode: 200,
        message: "Login successful88",
        data: {
            accessToken,
            user: {
                id: user._id,
                uid: user.uid,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        },
        success: true
    });
});

const googleLogin = catchAsync(async (req, res) => {
    const loginResponse = await authService.googleLoginService(req.body);
})

const userLogout = catchAsync(async (req, res) => {
    res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS)
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
    })
})

const forgotPassword = catchAsync(async (req, res) => {
    await authService.forgotPasswordService(req.body.email);

    return sendResponse(res, {
        statusCode: 200,
        message: "Email sent successfully",
        success: true
    });
})

const verifyOtpPassword = catchAsync(async (req, res) => {

    const isVerified = await authService.verifyOtpService(...req.body);

    return sendResponse(res, {
        statusCode: 200,
        message: "Email verified successfully!",
        success: true,
        data: { isVerified }
    });

})

const changePassword = catchAsync(async (req, res) => {

    const passwordReset = await authService.changePasswordService(...req.body)

    return sendResponse(res, {
        statusCode: 200,
        data: passwordReset,
        message: "password changed successfully",
        success: false,
    });

})

export default {
    userSignUp,
    userLogin,
    googleLogin,
    userLogout,
    forgotPassword,
    verifyOtpPassword,
    changePassword
}

