import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from '../config/envConfig.js';



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