import cloudinary from 'cloudinary';


// Upload Image Utility
export const uploadImageUtil = async (filePath) => {
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "SkillSwap",
    });

    return {
        public_id: response.public_id,
        url: response.url,
    };
};