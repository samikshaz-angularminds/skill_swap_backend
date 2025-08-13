import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import {envConfig} from '../config/envConfig.js';

// generate Access Token
export const generateAccessToken = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
    };

    return jwt.sign(payload, envConfig.access_token_secret, { expiresIn: '1h' });
}

// generate Refresh Token
export const generateRefreshToken = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(payload, envConfig.refresh_token_secret, { expiresIn: '7d' });
    return token;
}

// Upload Image Utility
export const uploadImage = async (filePath) => {
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap",
    });

    return {
        public_id: response.public_id,
        url: response.url,
    };
};